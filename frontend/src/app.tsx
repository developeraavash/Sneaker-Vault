import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function App() {
  return (
    <div className="p-2">
      <div className="lg:flex-row flex-col-reverse h-[800px] text-center p-4 flex items-center justify-center">
        <div className="flex gap-y-2 flex-col ">
          <h1
          style={{fontFamily:'sans-serif'}}
          className="text-5xl text-start max-w-[500px] z-50">
            Unlock Your Style, Step into SneakerVault
          </h1>
          <Link
            style={{ width: "max-content" }}
            className="bg-gray-800 text-sm p-2 text-white text-start"
            to={"/collections"}
          >
            Discover
          </Link>
        </div>
        <img className="animate-b" src="posters/model1.png" alt="" />
      </div>
      <div className="flex text-gray-700 p-4 items-center flex-col">
        <div className="flex flex-col gap-y-2">
          <h2 className="font-semibold">Most Popular Collections</h2>
          <div className="flex text-sm flex-col lg:flex-row gap-4">
            <div className="flex flex-col gap-x-2 gap-y-2">
              <img
                className="max-h-[500px] max-w-[400px]"
                src="posters/men.jpg"
              />
              <Link
                className="hover:text-gray-800"
                to={"/collections/?category=men"}
              >
                Men
              </Link>
            </div>
            <div className="flex flex-col gap-y-2">
              <img
                className="max-h-[500px] max-w-[400px]"
                src="posters/women2.webp"
              />
              <Link
                className="hover:text-gray-800"
                to={"/collections/?category=women"}
              >
                Women
              </Link>
            </div>
            <div className="flex flex-col max-w-[500px] gap-y-2">
              <img
                className="max-h-[500px] max-w-[400px]"
                src="posters/kid.jpg"
              />
              <Link
                className="hover:text-gray-800"
                to={"/collections/?category=kid"}
              >
                Kids
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="flex text-gray-700 flex-col gap-y-2 p-4 items-center justify-center">
        <div className="flex flex-col gap-y-2">
          <h5 className="font-semibold">Best Sellers</h5>
          <div className="grid grid-cols-2 gap-4">
            <div  className="flex flex-col gap-y-2">
              <img className="max-w-[400px]" src="posters/nike-air-max1.webp" />
              <div className="flex flex-col">
                <p className="text-sm">Nike Air Max 1</p>
                <span className="text-sm">
                  Rs <span className="font-semibold">15000</span>
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-y-2">
              <img
                className="max-w-[400px]"
                src="posters/nike-air-max-186OG.jpg"
              />
              <div className="flex flex-col">
                <p className="text-sm">Nike Air Max 1'86OG</p>
                <span className="text-sm">
                  Rs <span className="font-semibold">16000</span>
                </span>
              </div>
            </div>
            <div
              className="flex  transition-transform flex-col gap-y-2"
            >
              <img
                className="max-w-[400px]"
                src="posters/nike-air-max87-N7.webp"
              />
              <div>
                <p className="text-sm">Nike Air Max 87 N7</p>
                <span className="text-sm">
                  Rs <span className="font-semibold">17000</span>
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-y-2">
              <img
                className="max-w-[400px]"
                src="posters/nike-air-max-90.webp"
              />
              <div>
                <p className="text-sm">Nike Air Max 270</p>
                <span className="text-sm">
                  Rs <span className="font-semibold">15000</span>
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-y-2">
              <img
                className="max-w-[400px]"
                src="posters/nike-air-max-plus.webp"
              />
              <div>
                <p className="text-sm">Nike Air Max Plus</p>
                <span className="text-sm">
                  Rs <span className="font-semibold">16000</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Link
            to={"/collections"}
            className="text-white px-4 py-2 text-sm bg-gray-800"
          >
            View all
          </Link>
        </div>
      </div>
    </div>
  );
}
