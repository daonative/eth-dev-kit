import Header from "@/components/Header";
import EmptyState from "@/components/EmptyState";

export default function Home() {
  return (
    <>
      <Header />
      <div className="max-w-7xl m-auto h-full p-8">
        <EmptyState />
      </div>
    </>
  );
}
