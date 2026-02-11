import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Nat "mo:core/Nat";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  public type UsageContext = {
    #study;
    #work;
    #entertainment;
    #exercise;
    #social;
    #other : Text;
  };

  public type Event = {
    id : Text;
    timestamp : Time.Time;
    eventType : Text;
    duration : ?Nat; // In seconds
    context : ?UsageContext;
    tags : [Text];
    source : { #app; #browser };
  };

  public type Session = {
    id : Text;
    startTime : Time.Time;
    endTime : ?Time.Time;
    totalDuration : ?Nat; // Calculated in seconds
    events : [Event];
    classifiedContext : ?UsageContext;
    engagementScore : ?Nat; // Calculated based on interactions/focus (0-100)
  };

  public type RoutinePattern = {
    context : UsageContext;
    frequency : Nat;
    avgDuration : Nat; // In seconds
    timeOfDayDistribution : {
      morning : Nat;
      afternoon : Nat;
      evening : Nat;
      night : Nat;
    };
    dayOfWeekDistribution : {
      monday : Nat;
      tuesday : Nat;
      wednesday : Nat;
      thursday : Nat;
      friday : Nat;
      saturday : Nat;
      sunday : Nat;
    };
  };

  public type Recommendation = {
    title : Text;
    message : Text;
    category : Text; // FocusWindow, OveruseAlert, WellnessTip
    confidenceScore : Nat;
    urgencyLevel : { #low; #medium; #high };
    historicalPerformance : [Nat];
  };

  public type InteractionType = {
    #buttonClick;
    #formSubmit;
    #navigation;
    #contentView;
    #userInput;
    #uiChange;
    #appSpecific : Text;
  };

  public type DetailedEvent = {
    id : Text;
    timestamp : Time.Time;
    eventType : Text;
    duration : ?Nat;
    context : ?UsageContext;
    tags : [Text];
    source : { #app; #browser };
    interactionType : ?InteractionType;
    pageDetails : ?Text;
    deviceDetails : ?Text;
    additionalData : ?Text;
  };

  module Event {
    public type T = Event;
    public func compare(a : T, b : T) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  module DetailedEvent {
    public type T = DetailedEvent;
    public func compare(a : T, b : T) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  public type UserProfile = {
    givenName : Text;
    familyName : Text;
    company : Text;
    companyRole : Text;
    project : Text;
    projectTeamMembers : [Text];
    projectCustomer : Text;
    onboardingComplete : Bool;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Persistent storage for user data
  let userEventsMap = Map.empty<Principal, Map.Map<Text, Event>>();
  let userSessionsMap = Map.empty<Principal, Map.Map<Text, Session>>();
  let userPatternsMap = Map.empty<Principal, Map.Map<Text, RoutinePattern>>();
  let userRecommendationsMap = Map.empty<Principal, Map.Map<Text, Recommendation>>();
  let userDetailedEventsMap = Map.empty<Principal, Map.Map<Text, DetailedEvent>>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    ensureUserAccess(caller);
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    ensureUserAccess(caller);
    userProfiles.add(caller, profile);
  };

  // Event Logging (app & browser)
  public shared ({ caller }) func logEvent(event : Event) : async () {
    ensureUserAccess(caller);
    let userEvents = switch (userEventsMap.get(caller)) {
      case (?map) { map };
      case (null) {
        let newMap = Map.empty<Text, Event>();
        userEventsMap.add(caller, newMap);
        newMap;
      };
    };

    if (userEvents.containsKey(event.id)) { Runtime.trap("Event with this ID already exists.") };
    userEvents.add(event.id, event);
  };

  // Retrieve Events with Filters
  public query ({ caller }) func getEvents(filter : ?UsageContext) : async [Event] {
    ensureUserAccess(caller);
    switch (userEventsMap.get(caller)) {
      case (?events) {
        let filteredIter = events.values().filter(
          func(e) {
            switch (filter) {
              case (null) { true };
              case (?f) { switch (e.context) { case (null) { false }; case (?c) { c == f } } };
            };
          }
        );
        let filteredArray = filteredIter.toArray();
        filteredArray.sort();
      };
      case (null) { [] };
    };
  };

  // Get Paginated Events
  public query ({ caller }) func getPaginatedEvents(page : Nat, pageSize : Nat) : async [Event] {
    ensureUserAccess(caller);
    switch (userEventsMap.get(caller)) {
      case (?events) {
        let allEventsArray = events.values().toArray();
        let allEvents = allEventsArray.sort();
        let startIdx = page * pageSize;
        if (startIdx >= allEvents.size()) { return [] };
        let endIdx = if (startIdx + pageSize > allEvents.size()) {
          allEvents.size();
        } else { startIdx + pageSize };
        allEvents.sliceToArray(startIdx, endIdx);
      };
      case (null) { [] };
    };
  };

  // Add Detailed Event
  public shared ({ caller }) func addDetailedEvent(detailedEvent : DetailedEvent) : async () {
    ensureUserAccess(caller);
    let userDetailedEvents = switch (userDetailedEventsMap.get(caller)) {
      case (?map) { map };
      case (null) {
        let newMap = Map.empty<Text, DetailedEvent>();
        userDetailedEventsMap.add(caller, newMap);
        newMap;
      };
    };

    if (userDetailedEvents.containsKey(detailedEvent.id)) {
      Runtime.trap("DetailedEvent with this ID already exists.");
    };
    userDetailedEvents.add(detailedEvent.id, detailedEvent);
  };

  // Get Detailed Events
  public query ({ caller }) func getDetailedEvents(filter : ?UsageContext) : async [DetailedEvent] {
    ensureUserAccess(caller);
    switch (userDetailedEventsMap.get(caller)) {
      case (?detailedEvents) {
        let filteredIter = detailedEvents.values().filter(
          func(e) {
            switch (filter) {
              case (null) { true };
              case (?f) { switch (e.context) { case (null) { false }; case (?c) { c == f } } };
            };
          }
        );
        let filteredArray = filteredIter.toArray();
        filteredArray.sort();
      };
      case (null) { [] };
    };
  };

  // Pattern Storage
  public shared ({ caller }) func addRoutinePattern(pattern : RoutinePattern) : async () {
    ensureUserAccess(caller);
    let userPatterns = switch (userPatternsMap.get(caller)) {
      case (?map) { map };
      case (null) {
        let newMap = Map.empty<Text, RoutinePattern>();
        userPatternsMap.add(caller, newMap);
        newMap;
      };
    };

    let patternId = derivePatternId(pattern);
    if (userPatterns.containsKey(patternId)) { Runtime.trap("Pattern with this ID already exists.") };
    userPatterns.add(patternId, pattern);
  };

  // Per-Category Pattern Frequency
  public query ({ caller }) func getCategoryFrequency(category : UsageContext) : async Nat {
    ensureUserAccess(caller);
    switch (userPatternsMap.get(caller)) {
      case (?patterns) {
        let count = patterns.values().filter(
          func(p) { p.context == category }
        ).size();
        count;
      };
      case (null) { 0 };
    };
  };

  // Add Recommendation (OveruseDetections)
  public shared ({ caller }) func submitRecommendation(rec : Recommendation) : async () {
    ensureUserAccess(caller);
    let userRecs = switch (userRecommendationsMap.get(caller)) {
      case (?map) { map };
      case (null) {
        let newMap = Map.empty<Text, Recommendation>();
        userRecommendationsMap.add(caller, newMap);
        newMap;
      };
    };

    if (userRecs.containsKey(rec.title)) { Runtime.trap("Recommendation with this ID already exists.") };
    userRecs.add(rec.title, rec);
  };

  // Get Alerts by Urgency
  public query ({ caller }) func getAlertsByUrgency(urgency : { #low; #medium; #high }) : async [Recommendation] {
    ensureUserAccess(caller);
    switch (userRecommendationsMap.get(caller)) {
      case (?recs) {
        let filteredIter = recs.values().filter(
          func(r) { r.urgencyLevel == urgency }
        );
        filteredIter.toArray();
      };
      case (null) { [] };
    };
  };

  // Get All Data
  public query ({ caller }) func getAllData() : async {
    events : [Event];
    patterns : [RoutinePattern];
    recommendations : [Recommendation];
    detailedEvents : [DetailedEvent];
  } {
    ensureUserAccess(caller);
    let events = switch (userEventsMap.get(caller)) {
      case (?events) {
        let eventsArray = events.values().toArray();
        eventsArray.sort();
      };
      case (null) { [] };
    };
    let patterns = switch (userPatternsMap.get(caller)) {
      case (?patterns) { patterns.values().toArray() };
      case (null) { [] };
    };
    let recs = switch (userRecommendationsMap.get(caller)) {
      case (?recs) { recs.values().toArray() };
      case (null) { [] };
    };
    let detailedEvents = switch (userDetailedEventsMap.get(caller)) {
      case (?detailedEvents) {
        let detailedEventsArray = detailedEvents.values().toArray();
        detailedEventsArray.sort();
      };
      case (null) { [] };
    };
    {
      events;
      patterns;
      recommendations = recs;
      detailedEvents;
    };
  };

  // Category Usage Percentage
  public query ({ caller }) func getCategoryPercentage(category : UsageContext) : async Nat {
    ensureUserAccess(caller);
    let total = switch (userEventsMap.get(caller)) {
      case (?events) { events.values().size() };
      case (null) { 0 };
    };
    if (total == 0) { return 0 };
    let count = switch (userEventsMap.get(caller)) {
      case (?events) {
        events.values().filter(
          func(e) {
            switch (e.context) {
              case (null) { false };
              case (?c) { c == category };
            };
          }
        ).size();
      };
      case (null) { 0 };
    };
    (count * 100) / total;
  };

  // Helper Functions
  func ensureUserAccess(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access this resource");
    };
  };

  func derivePatternId(pattern : RoutinePattern) : Text {
    let contextText : Text = switch (pattern.context) {
      case (#study) { "study" };
      case (#work) { "work" };
      case (#entertainment) { "entertainment" };
      case (#exercise) { "exercise" };
      case (#social) { "social" };
      case (#other(text)) { text };
    };
    contextText.concat("_").concat(pattern.frequency.toText());
  };
};
