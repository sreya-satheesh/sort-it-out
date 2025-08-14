import { SortItOutApp } from "@/components/sort-it-out-app";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 bg-background">
      <div className="w-full max-w-7xl mx-auto flex-grow">
        <header className="text-center mb-12">
          <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl font-bold text-foreground">
            Sort It Out!
          </h1>
          <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
            An interactive way to visualize sorting algorithms. Select an algorithm, generate an array, and watch it get sorted step-by-step.
          </p>
        </header>
        <SortItOutApp />
      </div>
      <footer className="w-full max-w-7xl mx-auto text-center mt-12 text-muted-foreground text-sm">
        <p>Created with ❤️, from India.</p>
      </footer>
    </main>
  );
}
