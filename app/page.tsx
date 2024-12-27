import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-col max-w-5xl justify-center text-center gap-6 h-screen mx-auto">
      <h1 className="text-5xl font-bold">Invoice Now</h1>
      <p>
        <Button asChild>
          <a href="/dashboard">Sign In</a>
        </Button>
        
      </p>
 
    </main>
  );
}
