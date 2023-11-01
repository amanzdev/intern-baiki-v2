import SEOHead from "@/components/SEOHead";
import { Menu } from "@headlessui/react";
import { Source_Serif_4 } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { fetchCompanyData, fetchCompanyDataById } from "../../backend/firebase";
import { DocumentData } from "firebase/firestore";
import { useRouter } from "next/router";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: "100" });
const sourceSerif4 = Source_Serif_4({ subsets: ["latin"] });

export default function Home() {
  const [companyData, setCompanyData] = useState<DocumentData[]>([]);

  // Apply the "Poppins" font to the entire page
  useEffect(() => {
    // Check if we are in the browser environment
    if (typeof window !== 'undefined') {
      // Set the "Poppins" font for the body element
      document.body.style.fontFamily = "Poppins, sans-serif";
      document.head.style.fontFamily = "Poppins, sans-serif";
    }
  }, []);

  useEffect(() => {
    // Fetch company data when the component mounts
    const fetchData = async () => {
      const companies = await fetchCompanyData();
      setCompanyData(companies);
    };

    fetchData();
  }, []);

  const router = useRouter();
  const { documentId } = router.query;

  useEffect(() => {
    if (documentId) {
      const companyIdValue = Array.isArray(documentId) ? documentId[0] : documentId;

      console.log('companyId:', documentId);
      console.log('companyIdValue:', companyIdValue);

      // Fetch data for the specified company using companyIdValue
      fetchCompanyDataById(companyIdValue)
        .then((companyData) => {
          // Handle the company data (e.g., set it in state)
          console.log('Fetched Company Data:', companyData);
        })
        .catch((error) => {
          // Handle errors
          console.error('Error fetching company data:', error);
        });
    }
  }, [documentId]);

  const title =
    "Baiki.com – Your One-Stop Gadget Services Hub in Malaysia!";
  const description =
    "The most comprehensive list for repair services in Malaysia. Find the closest repair centre for you!";

  return (
    <div className="flex flex-col">
      {/* Header Desktop */}
      <header className="relative z-10 flex items-center justify-between p-2" style={{ backgroundColor: "#F35252" }}>
        <div className="hidden sm:inline-flex justify-center w-full">
          <Link href="/">
            <img
              src="/logo.png"
              className="h-[50px] md:h-[62px] ml-10"
              alt="Baiki logo"
            />
          </Link>
        </div>

        <div className="hidden md:inline-flex md:space-x-4">
          <button className="btn-normal-case text-white">
            <Link href="/addCompany">
              Add Company
            </Link>
          </button>
        </div>

        <div className="hidden md:inline-flex md:space-x-4">
          {/* Add the Search Icon button with no background */}
          <button className="btn-normal-case">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-8 fill-white stroke-primary"
            height="24" 
            viewBox="0 -960 960 960" 
            width="24"
          >
            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
          </svg>
          </button>
        </div>

        <Menu>
          <div className="hidden md:inline-flex md:space-x-4">
            {/* Profile icon without a background */}
            <Menu.Button>
              <svg 
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-8 fill-white stroke-primary" 
                height="24" 
                viewBox="0 -960 960 960" 
                width="24"
              >
                <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/>
              </svg>
            </Menu.Button>
            <Menu.Items className="absolute text-center right-3 z-10 mt-8 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-0">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      className={`${active && 'bg-red-500 text-white block rounded-md px-4 py-2' || 'block rounded-md px-4 py-2'}`}
                      href="/account-login"
                    >
                      Log Masuk
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      className={`${active && 'bg-red-500 text-white block rounded-md px-4 py-2' || 'block rounded-md px-4 py-2'}`}
                      href="/account-signup"
                    >
                      Daftar
                    </a>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </div>
        </Menu>

        {/* Header Mobile */}
        <div className="md:hidden inline-flex">
          {/* Add the Search Icon button with no background */}
          <button className="btn-normal-case">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-8 fill-white stroke-primary"
            height="24" 
            viewBox="0 -960 960 960" 
            width="24"
          >
            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
          </svg>
          </button>
        </div>
        <div className="md:hidden inline-flex">
          <Link href="/">
            <img
              src="/logo.png"
              className="h-[50px] md:h-[62px]"
              alt="Baiki logo"
            />
          </Link>
        </div>
        <Menu>
        <div className="md:hidden inline-flex md:space-x-4">
          {/* Profile icon without a background */}
          <Menu.Button>
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-8 fill-white stroke-primary" 
              height="24" 
              viewBox="0 -960 960 960" 
              width="24"
            >
              <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/>
            </svg>
          </Menu.Button>
          <Menu.Items className="absolute text-center right-3 z-10 mt-8 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-0">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    className={`${active && 'bg-red-500 text-white block rounded-md px-4 py-2' || 'block rounded-md px-4 py-2'}`}
                    href="/account-login"
                  >
                    Log Masuk
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    className={`${active && 'bg-red-500 text-white block rounded-md px-4 py-2' || 'block rounded-md px-4 py-2'}`}
                    href="/account-signup"
                  >
                    Daftar
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </div>
        </Menu>
      </header>

      <SEOHead title={title} description={description} path="/" />
      <main className="md:mt-4" style={{ backgroundColor: "#F5F5F5" }}>

        {/* desktop view */}
        <div className="mx-auto mb-16 mt-8 hidden max-w-6xl px-4 md:block">
          <div className="flex w-full justify-between">
            <p className="mt-10">
              <a className="text-[#F35252] font-semibold text-xl">Baiki.</a>
              <a className="text-xl"> Hub carian untuk baiki dan ganti gajet.</a>
            </p>

            <div className="flex gap-4">
              {/* Rounded Square Buttons */}
              <button className="rounded-lg bg-white hover:bg-red-500 p-3 focus:outline-none w-32 group active:bg-red-600">
                <div className="flex flex-col items-center">
                  <div className="rounded-full p-2 mb-2">
                    {/* Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48" // Adjust the width as needed
                      height="48" // Adjust the height as needed
                      fill="black" // Set the fill color to black
                      viewBox="0 -960 960 960" // Adjust the viewBox as needed
                      className="group-hover:fill-white"
                    >
                      <path 
                        d="M280-40q-33 0-56.5-23.5T200-120v-720q0-33 23.5-56.5T280-920h400q33 0 56.5 23.5T760-840v720q0 33-23.5 56.5T680-40H280Zm0-120v40h400v-40H280Zm0-80h400v-480H280v480Zm0-560h400v-40H280v40Zm0 0v-40 40Zm0 640v40-40Z"
                      />
                    </svg>
                  </div>
                  {/* Button Label */}
                  <span className="text-black group-hover:text-white">Telefon Pintar</span>
                </div>
              </button>

              <button className="rounded-lg bg-white hover:bg-red-500 p-3 focus:outline-none w-32 group active:bg-red-600">
                <div className="flex flex-col items-center">
                  <div className="rounded-full p-2 mb-2">
                    {/* Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48" // Adjust the width as needed
                      height="48" // Adjust the height as needed
                      fill="black" // Set the fill color to black
                      viewBox="0 -960 960 960" // Adjust the viewBox as needed
                      className="group-hover:fill-white"
                    >
                      <path 
                        d="m360-80-54-182q-48-38-77-95t-29-123q0-66 29-123t77-95l54-182h240l54 182q48 38 77 95t29 123q0 66-29 123t-77 95L600-80H360Zm120-200q83 0 141.5-58.5T680-480q0-83-58.5-141.5T480-680q-83 0-141.5 58.5T280-480q0 83 58.5 141.5T480-280Zm-76-470q20-5 38.5-8t37.5-3q19 0 37.5 3t38.5 8l-16-50H420l-16 50Zm16 590h120l16-50q-20 5-38.5 7.5T480-200q-19 0-37.5-2.5T404-210l16 50Zm-16-640h152-152Zm16 640h-16 152-136Z"
                      />
                    </svg>
                  </div>
                  {/* Button Label */}
                  <span className="text-black group-hover:text-white">Jam Pintar</span>
                </div>
              </button>
              
              <button className="rounded-lg bg-white hover:bg-red-500 p-3 focus:outline-none w-34 group active:bg-red-600">
                <div className="flex flex-col items-center">
                  <div className="rounded-full p-2 mb-2">
                    {/* Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48" // Adjust the width as needed
                      height="48" // Adjust the height as needed
                      fill="black" // Set the fill color to black
                      viewBox="0 -960 960 960" // Adjust the viewBox as needed
                      className="group-hover:fill-white"
                    >
                      <path 
                      d="M80-120q-17 0-28.5-11.5T40-160q0-17 11.5-28.5T80-200h800q17 0 28.5 11.5T920-160q0 17-11.5 28.5T880-120H80Zm80-120q-33 0-56.5-23.5T80-320v-440q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v440q0 33-23.5 56.5T800-240H160Zm0-80h640v-440H160v440Zm0 0v-440 440Z"
                      />
                    </svg>
                  </div>
                  {/* Button Label */}
                  <span className="text-black group-hover:text-white">Komputer Riba</span>
                </div>
              </button>

              <button className="rounded-lg bg-white hover:bg-red-500 p-3 focus:outline-none w-32 group active:bg-red-600">
                <div className="flex flex-col items-center">
                  <div className="rounded-full p-2 mb-2">
                    {/* Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48" // Adjust the width as needed
                      height="48" // Adjust the height as needed
                      fill="black" // Set the fill color to black
                      viewBox="0 -960 960 960" // Adjust the viewBox as needed
                      className="group-hover:fill-white"
                    >
                      <path 
                      d="M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Zm0-80h640v-480H638l-73-80H395l-73 80H160v480Zm320-240Z"
                      />
                    </svg>
                  </div>
                  {/* Button Label */}
                  <span className="text-black group-hover:text-white">Kamera</span>
                </div>
              </button>

              <button className="rounded-lg bg-white hover:bg-red-500 p-3 focus:outline-none w-32 group active:bg-red-600">
                <div className="flex flex-col items-center">
                  <div className="rounded-full p-2 mb-2">
                    {/* Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48" // Adjust the width as needed
                      height="48" // Adjust the height as needed
                      fill="black" // Set the fill color to black
                      viewBox="0 -960 960 960" // Adjust the viewBox as needed
                      className="group-hover:fill-white"
                    >
                      <path 
                      d="M160-760h320v-40H160v40Zm0 680q-33 0-56.5-23.5T80-160v-640q0-33 23.5-56.5T160-880h320q33 0 56.5 23.5T560-800v154q-23 12-43 27.5T480-584v-96H160v400h257q8 22 18.5 42t24.5 38H160v40h320v-16q15 17 32 31t37 25q-11 18-28.5 29T480-80H160Zm540-160q58 0 99-41t41-99q0-58-41-99t-99-41q-58 0-99 41t-41 99q0 58 41 99t99 41ZM600-80v-104q-54-27-87-79t-33-117q0-65 33-117t87-79v-104h200v104q54 27 87 79t33 117q0 65-33 117t-87 79v104H600ZM160-200v40-40Zm0-560v-40 40Z"
                      />
                    </svg>
                  </div>
                  {/* Button Label */}
                  <span className="text-black group-hover:text-white">Aksesori</span>
                </div>
              </button>
            </div>
          </div>
          <div className="flex w-full mt-4">
            <p>
              <a className="font-semibold">Semua kedai. </a>
              <a>Pilih kedai berdekatan anda.</a>
            </p>
          </div>
          <div className="relative mt-8">
            <div className="relative w-full flex gap-4 overflow-x-auto">
              <div className="snap-start shrink-0">
                <button className="rounded-lg bg-white p-3 focus:outline-none h-full">
                  <div className="flex flex-col items-center p-2 mb-2">
                    <div className="relative mt-6">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        height="24" 
                        viewBox="0 -960 960 960" 
                        width="24">
                        <path d="M400-240 160-480l240-240 56 58-142 142h486v80H314l142 142-56 58Z"/>
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
              <div className="snap-start shrink-0">
                <div className="flex gap-4">
                  {companyData.map((company, index) => (
                    <div className="rounded-lg bg-white p-3 focus:outline-none">
                      <p className="text-center font-semibold">
                        {company.name}
                      </p>
                      <p className="text-center">
                        {company.district}, {company.state}
                      </p>
                      <div className="flex flex-col items-center">
                        <div className="rounded-full p-2 mb-2">
                          {/* Image */}
                          {company.picture1 ? (
                            <img className="max-w-[400px] h-[150px]" src={company.picture1} />
                            ) : (
                              'Loading...'
                            )}
                        </div>
                        {/* Button Label */}
                        <Link className="rounded-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white px-4 py-2" href={`/companyProfile?documentId=${company.documentId}`}>Profil</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="snap-start shrink-0">
                <button className="rounded-lg bg-white p-3 focus:outline-none h-full">
                  <div className="flex flex-col items-center p-2 mb-2">
                    <div className="relative mt-6">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        height="24" 
                        viewBox="0 -960 960 960" 
                        width="24">
                        <path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z"/>
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* mobile view */}
        <div className="mx-4 mb-16 mt-6 flex flex-col space-y-2 md:hidden">
          <p className="mt-2">
            <a className="text-[#F35252] font-semibold text-xl">Baiki.</a>
            <a className="text-xl"> Hub carian untuk baiki dan ganti gajet.</a>
          </p>
          <div className="flex gap-1 py-4">
            {/* Rounded Square Buttons */}
            <button className="rounded-lg bg-white hover:bg-red-500 p-3 focus:outline-none w-32 group active:bg-red-600">
              <div className="flex flex-col items-center">
                <div className="rounded-full p-1 mb-1">
                  {/* Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16" // Adjust the width as needed
                    height="16" // Adjust the height as needed
                    fill="black" // Set the fill color to black
                    viewBox="0 -960 960 960" // Adjust the viewBox as needed
                    className="group-hover:fill-white"
                  >
                    <path 
                      d="M280-40q-33 0-56.5-23.5T200-120v-720q0-33 23.5-56.5T280-920h400q33 0 56.5 23.5T760-840v720q0 33-23.5 56.5T680-40H280Zm0-120v40h400v-40H280Zm0-80h400v-480H280v480Zm0-560h400v-40H280v40Zm0 0v-40 40Zm0 640v40-40Z"
                    />
                  </svg>
                </div>
                {/* Button Label */}
                <span className="text-black group-hover:text-white text-xs">Telefon Pintar</span>
              </div>
            </button>

            <button className="rounded-lg bg-white hover:bg-red-500 p-3 focus:outline-none w-32 group active:bg-red-600">
              <div className="flex flex-col items-center">
                <div className="rounded-full p-1 mb-1">
                  {/* Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16" // Adjust the width as needed
                    height="16" // Adjust the height as needed
                    fill="black" // Set the fill color to black
                    viewBox="0 -960 960 960" // Adjust the viewBox as needed
                    className="group-hover:fill-white"
                  >
                    <path 
                      d="m360-80-54-182q-48-38-77-95t-29-123q0-66 29-123t77-95l54-182h240l54 182q48 38 77 95t29 123q0 66-29 123t-77 95L600-80H360Zm120-200q83 0 141.5-58.5T680-480q0-83-58.5-141.5T480-680q-83 0-141.5 58.5T280-480q0 83 58.5 141.5T480-280Zm-76-470q20-5 38.5-8t37.5-3q19 0 37.5 3t38.5 8l-16-50H420l-16 50Zm16 590h120l16-50q-20 5-38.5 7.5T480-200q-19 0-37.5-2.5T404-210l16 50Zm-16-640h152-152Zm16 640h-16 152-136Z"
                    />
                  </svg>
                </div>
                {/* Button Label */}
                <span className="text-black group-hover:text-white text-xs">Jam Pintar</span>
              </div>
            </button>
              
            <button className="rounded-lg bg-white hover:bg-red-500 p-3 focus:outline-none w-34 group active:bg-red-600">
              <div className="flex flex-col items-center">
                <div className="rounded-full p-1 mb-1">
                  {/* Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16" // Adjust the width as needed
                    height="16" // Adjust the height as needed
                    fill="black" // Set the fill color to black
                    viewBox="0 -960 960 960" // Adjust the viewBox as needed
                    className="group-hover:fill-white"
                  >
                    <path 
                    d="M80-120q-17 0-28.5-11.5T40-160q0-17 11.5-28.5T80-200h800q17 0 28.5 11.5T920-160q0 17-11.5 28.5T880-120H80Zm80-120q-33 0-56.5-23.5T80-320v-440q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v440q0 33-23.5 56.5T800-240H160Zm0-80h640v-440H160v440Zm0 0v-440 440Z"
                    />
                  </svg>
                </div>
                {/* Button Label */}
                <span className="text-black group-hover:text-white text-xs">Komputer Riba</span>
              </div>
            </button>

            <button className="rounded-lg bg-white hover:bg-red-500 p-3 focus:outline-none w-32 group active:bg-red-600">
              <div className="flex flex-col items-center">
                <div className="rounded-full p-1 mb-1">
                  {/* Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16" // Adjust the width as needed
                    height="16" // Adjust the height as needed
                    fill="black" // Set the fill color to black
                    viewBox="0 -960 960 960" // Adjust the viewBox as needed
                    className="group-hover:fill-white"
                  >
                    <path 
                    d="M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Zm0-80h640v-480H638l-73-80H395l-73 80H160v480Zm320-240Z"
                    />
                  </svg>
                </div>
                {/* Button Label */}
                <span className="text-black group-hover:text-white text-xs">Kamera</span>
              </div>
            </button>

            <button className="rounded-lg bg-white hover:bg-red-500 p-3 focus:outline-none w-32 group active:bg-red-600">
              <div className="flex flex-col items-center">
                <div className="rounded-full p-1 mb-1">
                  {/* Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16" // Adjust the width as needed
                    height="16" // Adjust the height as needed
                    fill="black" // Set the fill color to black
                    viewBox="0 -960 960 960" // Adjust the viewBox as needed
                    className="group-hover:fill-white"
                  >
                    <path 
                    d="M160-760h320v-40H160v40Zm0 680q-33 0-56.5-23.5T80-160v-640q0-33 23.5-56.5T160-880h320q33 0 56.5 23.5T560-800v154q-23 12-43 27.5T480-584v-96H160v400h257q8 22 18.5 42t24.5 38H160v40h320v-16q15 17 32 31t37 25q-11 18-28.5 29T480-80H160Zm540-160q58 0 99-41t41-99q0-58-41-99t-99-41q-58 0-99 41t-41 99q0 58 41 99t99 41ZM600-80v-104q-54-27-87-79t-33-117q0-65 33-117t87-79v-104h200v104q54 27 87 79t33 117q0 65-33 117t-87 79v104H600ZM160-200v40-40Zm0-560v-40 40Z"
                    />
                  </svg>
                </div>
                {/* Button Label */}
                <span className="text-black group-hover:text-white text-xs">Aksesori</span>
              </div>
            </button>
          </div>
          <div className="flex w-full">
            <p>
              <a className="font-semibold">Semua kedai. </a>
              <a>Pilih kedai berdekatan anda.</a>
            </p>
          </div>
          <div className="relative py-2">
            <div className="relative w-full flex gap-4 snap-x snap-mandatory overflow-x-auto">
              <div className="snap-start shrink-0">
                <button className="rounded-lg bg-white p-3 focus:outline-none h-full">
                  <div className="flex flex-col items-center p-2 mb-2">
                    <div className="relative mt-6">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        height="24" 
                        viewBox="0 -960 960 960" 
                        width="24">
                        <path d="M400-240 160-480l240-240 56 58-142 142h486v80H314l142 142-56 58Z"/>
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
              <div className="snap-start shrink-0">
                <div className="flex gap-4 snap-x snap-mandatory overflow-x-auto">
                  {companyData.map((company, index) => (
                    <div className="rounded-lg bg-white p-3 focus:outline-none">
                      <p className="text-center font-semibold">
                        {company.name}
                      </p>
                      <p className="text-center">
                        {company.district}, {company.state}
                      </p>
                      <div className="flex flex-col items-center">
                        <div className="rounded-full p-2 mb-2">
                          {/* Image */}
                          {company.picture1 ? (
                            <img className="max-w-[250px] h-[100px]" src={company.picture1} />
                          ) : (
                            'Loading...'
                          )}
                          </div>
                        {/* Button Label */}
                        <Link className="rounded-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white px-4 py-2" href={`/companyProfile?documentId=${company.documentId}`}>Profil</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="snap-start shrink-0">
                <button className="rounded-lg bg-white p-3 focus:outline-none h-full">
                  <div className="flex flex-col items-center p-2 mb-2">
                    <div className="relative mt-6">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        height="24" 
                        viewBox="0 -960 960 960" 
                        width="24">
                        <path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z"/>
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}