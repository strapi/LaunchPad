import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";
import { Folder, Grid, Layers, Palette, Repeat, Users } from "lucide-react";

const roadmapItems = [
  {
    title: "Global Theme Editor",
    description: "Create and manage complete themes with presets for your entire application.",
    status: "Done",
    icon: <Palette className="size-5" />,
  },
  {
    title: "Theme Import/Export",
    description: "Save and share your custom themes with others.",
    status: "Done",
    icon: <Repeat className="size-5" />,
  },
  {
    title: "AI Theme Generation",
    description:
      "Generate and customize themes with AI assistance, making theme creation faster and more intuitive",
    status: "In Progress",
    icon: <Layers className="size-5" />,
  },
  {
    title: "Community Themes",
    description: "Allow users to submit themes, vote on the best designs",
    status: "Coming Soon",
    icon: <Users className="size-5" />,
  },
  {
    title: "Multi-Project Management",
    description:
      "Save and manage multiple theme projects, making it easy to switch between designs.",
    status: "Planned",
    icon: <Folder className="size-5" />,
  },
  {
    title: "Smart Theme Generator",
    description:
      "Generate beautiful themes from a single color, color pair, or even an image. Expand your customization options with AI-powered theme generation.",
    status: "Planned",
    icon: <Grid className="size-5" />,
  },
];

export function Roadmap() {
  return (
    <section
      id="roadmap"
      className="from-muted/30 relative isolate w-full overflow-hidden bg-linear-180 from-50% to-transparent py-20 md:py-32"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(from_var(--secondary)_r_g_b_/0.05),transparent_50%)]"></div>

      <div className="relative container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 flex flex-col items-center justify-center space-y-4 text-center"
        >
          <Badge
            className="rounded-full px-4 py-1.5 text-sm font-medium shadow-sm"
            variant="secondary"
          >
            <span className="text-primary mr-1">✦</span> Roadmap
          </Badge>
          <h2 className="from-foreground to-foreground/80 bg-gradient-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
            What&apos;s Coming Next
          </h2>
          <p className="text-muted-foreground max-w-[800px] md:text-lg">
            We&apos;re constantly working to improve tweakcn and add new features. Here&apos;s
            what&apos;s on our roadmap.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {roadmapItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="border-border/40 from-card to-card/50 hover:border-primary/20 h-full overflow-hidden bg-gradient-to-b backdrop-blur transition-all hover:shadow-lg">
                <CardContent className="flex h-full flex-col p-6">
                  <div className="bg-primary/10 text-primary mb-4 flex size-12 items-center justify-center rounded-full">
                    {item.icon}
                  </div>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <Badge
                      variant={
                        item.status === "In Progress"
                          ? "default"
                          : item.status === "Coming Soon"
                            ? "secondary"
                            : "outline"
                      }
                      className="shadow-sm"
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
