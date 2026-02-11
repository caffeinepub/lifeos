interface BrandHeaderProps {
  showHero?: boolean;
}

export default function BrandHeader({ showHero = false }: BrandHeaderProps) {
  return (
    <div className="flex flex-col items-center space-y-6">
      <img
        src="/assets/generated/lifeos-logo.dim_512x512.png"
        alt="LifeOS"
        className="h-20 w-auto"
      />
      {showHero && (
        <img
          src="/assets/generated/lifeos-hero.dim_1600x900.png"
          alt="LifeOS Dashboard"
          className="w-full max-w-2xl rounded-lg shadow-lg"
        />
      )}
    </div>
  );
}
