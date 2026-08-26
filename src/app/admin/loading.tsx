import { SpheraLoader } from "@/components/ui";

export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <SpheraLoader text="Carregando dados..." variant="inline" />
    </div>
  );
}
