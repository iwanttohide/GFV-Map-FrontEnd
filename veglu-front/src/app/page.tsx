import Image from "next/image";

export default function Home() {
  return (
    <div className="main-layout h-screen flex flex-col">
    {/*  1. 상단 고정 헤더*/}
    <Header />

    {/*  2. 하단 콘텐츠 영역(세로로 남은 나머지 공간)*/}
      <div className="content-area flex flex-1 overflow-hidden">
         {/* 2-1. 좌측 사이드바(고정 넓이, 내부 스크롤)*/}
         <Sidebar />

         {/* 2-2. 우측 지도 (사이드바 제외하고 채우기)*/}
         <MapContainer />
      </div>
    </div>
  );
}
