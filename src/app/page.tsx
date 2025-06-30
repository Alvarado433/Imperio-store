import BannerCarousel from "@/components/Imperio/Banners/banner";
import BannerFilter from "@/components/Imperio/Banners/BannerFilte";
import Cupons from "@/components/Imperio/Cupons/cupons";
import Footer from "@/components/Imperio/Footer/Rodape";
import Navbar from "@/components/Imperio/Inicio/Navbar";
import ProdutosEmDestaque from "@/components/Produtos/MelhoresProdutos";
import WhatsappButton from "@/components/Whatsapp/whats";


export default function Home() {
  return (
    <>
      <Navbar />
      <BannerCarousel />
      <ProdutosEmDestaque />
      <Cupons />
      < BannerFilter />
      <WhatsappButton phoneNumber={""} />
      <Footer />
    </>
  );
}
