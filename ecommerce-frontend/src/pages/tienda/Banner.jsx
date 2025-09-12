import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

function Banner() {
  const imagenes = [
    'https://blog.plazavea.com.pe/wp-content/uploads/2024/02/marcas-de-vino-dulce.jpg',
    'https://marquesdelatrio.com/wp-content/uploads/2023/03/que-es-envejecimiento-del-vino.jpg',
    'https://media.istockphoto.com/id/991732782/es/foto/primer-plano-de-sumiller-sirviendo-vino-tinto-en-el-restaurante.webp?a=1&b=1&s=612x612&w=0&k=20&c=k6TjOmT4e3EAQ2Vcoh2IW9qjVxrDtywCbLCFxMR-OoA=',
    'https://media.istockphoto.com/id/1181627160/photo/grape-harvest-bucket-with-red-wine-bottle-and-wine-glass.jpg?s=612x612&w=0&k=20&c=M5czLWMt6oHlSmHUq0ndsnZPk5QppWmCM3cLBY4s0JU=', 
    'https://www.saborusa.com/sv/wp-content/uploads/sites/4/2019/10/Vino-para-quedarse-Foto-destacada.png',
];

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000 }}
      loop={true}
    >
      {imagenes.map((url, index) => (
        <SwiperSlide key={index}>
          <img
            src={url}
            alt={`Banner ${index + 1}`}
            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default Banner;
