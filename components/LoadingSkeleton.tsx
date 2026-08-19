export default function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Result card skeleton */}
      <div className="glass-card rounded-3xl p-6 sm:p-7">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-6 w-24 rounded-full bg-[#3ba899]/20 animate-pulse" />
          <div className="h-4 w-32 rounded bg-[#617db0]/20 animate-pulse" />
        </div>
        <div className="mb-4 rounded-2xl bg-black/30 p-4">
          <div className="h-3 w-16 rounded bg-[#617db0]/20 animate-pulse mb-2" />
          <div className="h-5 w-3/4 rounded bg-[#E6E6FA]/20 animate-pulse" />
        </div>
        <div>
          <div className="h-3 w-20 rounded bg-[#3ba899]/20 animate-pulse mb-2" />
          <div className="h-7 w-2/3 rounded bg-[#E6E6FA]/30 animate-pulse" />
        </div>
      </div>

      {/* Pronunciation card skeleton */}
      <div className="pronunciation-card-glow rounded-3xl p-6 sm:p-7 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-36 rounded-full bg-[#24d564]/20 animate-pulse" />
          <div className="flex gap-2">
            <div className="h-7 w-16 rounded-xl bg-[#bfdb38]/20 animate-pulse" />
            <div className="h-7 w-24 rounded-xl bg-[#24d564]/30 animate-pulse" />
          </div>
        </div>
        <div className="h-5 w-4/5 rounded bg-[#617db0]/30 animate-pulse mb-3" />
        <div className="rounded-2xl bg-black/40 p-5 mb-3">
          <div className="space-y-2">
            <div className="h-9 w-full rounded bg-[#24d564]/30 animate-pulse" />
            <div className="h-9 w-2/3 rounded bg-[#24d564]/30 animate-pulse" />
          </div>
        </div>
        <div className="h-4 w-36 rounded bg-[#617db0]/20 animate-pulse" />
      </div>

      {/* Examples skeleton */}
      <div className="space-y-3">
        <div className="h-6 w-36 rounded-full bg-[#bfdb38]/20 animate-pulse mb-3" />
        <div className="grid gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-4"
            >
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="h-4 w-3/4 rounded bg-[#E6E6FA]/20 animate-pulse" />
                <div className="h-4 w-2/3 rounded bg-[#617db0]/20 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
