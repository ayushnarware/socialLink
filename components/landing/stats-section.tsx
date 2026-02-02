"use client"

const stats = [
  {
    value: "10x",
    label: "faster link creation",
    company: "TechCrunch",
  },
  {
    value: "300%",
    label: "increase in engagement",
    company: "Forbes",
  },
  {
    value: "50M+",
    label: "links tracked monthly",
    company: "Wired",
  },
  {
    value: "4.9/5",
    label: "average rating",
    company: "Product Hunt",
  },
]

export function StatsSection() {
  return (
    <section className="border-y border-border/50 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl font-bold text-foreground sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                {stat.company}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
