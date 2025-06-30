import CategoriaClient from "@/components/Categoria/cate";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function Page({ params }: any) {
  return <CategoriaClient categoria={params.categoria} />;
}
