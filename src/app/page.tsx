import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4">
        ini homepage
      </h1>
      <p className="text-lg text-muted-foreground max-w-[600px]">
        Welcome to CinemaID. Please login to book your favorite movies.
      </p>
    </div>
  );
}
