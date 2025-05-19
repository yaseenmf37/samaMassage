import React from "react";

const Servises = () => {
  const Carts = [
    {
      id: 1,
      title: "s",
      body: "Lorem ipsum dolor sit amet consectetur adipisicing elit.Necessitatibus laborum quas quisquam. Fugiat porro minus ullam mollitia cumque, perspiciatis sequi illum ut dolorum ipsa, odio molestias officiis consequatur quasi cupiditate?",
      src: "../../public/img.png",
    },
    {
      id: 2,
      title: "s",
      body: "Lorem ipsum dolor sit amet consectetur adipisicing elit.Necessitatibus laborum quas quisquam. Fugiat porro minus ullam mollitia cumque, perspiciatis sequi illum ut dolorum ipsa, odio molestias officiis consequatur quasi cupiditate?",
      src: "../../public/img.png",
    },
    {
      id: 3,
      title: "s",
      body: "Lorem ipsum dolor sit amet consectetur adipisicing elit.Necessitatibus laborum quas quisquam. Fugiat porro minus ullam mollitia cumque, perspiciatis sequi illum ut dolorum ipsa, odio molestias officiis consequatur quasi cupiditate?",
      src: "../../public/img.png",
    },
    {
      id: 4,
      title: "s",
      body: "Lorem ipsum dolor sit amet consectetur adipisicing elit.Necessitatibus laborum quas quisquam. Fugiat porro minus ullam mollitia cumque, perspiciatis sequi illum ut dolorum ipsa, odio molestias officiis consequatur quasi cupiditate?",
      src: "../../public/img.png",
    },
  ];
  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-around gap-2 max-md:gap-10">
        {Carts.map((cart) => (
          <span
            id={cart.id}
            className="rounded-xl bg-[#fff] max-md:w-full w-1/5 p-4 flex text-center items-center min-w-64 flex-col h-auto"
          >
            <img src={cart.src} alt="" className="mb-4 rounded-lg" />
            <p>{cart.title}</p>
            <span className="flex-grow text-left">{cart.body}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Servises;
