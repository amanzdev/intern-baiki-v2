import SEOHead from "@/components/SEOHead";
import { Menu } from "@headlessui/react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { addData } from "../../backend/firebase";
import { useRouter } from "next/router";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getStorage } from "firebase/storage";
import { useEffect, useState } from "react";

const poppins = Poppins({ subsets: ["latin"], weight:"100" });

export default function Home() {
  // Apply the "Poppins" font to the entire page
  useEffect(() => {
    // Check if we are in the browser environment
    if (typeof window !== 'undefined') {
      // Set the "Poppins" font for the body element
      document.body.style.fontFamily = "Poppins, sans-serif";
    }
  }, []);

  const router = useRouter();
  const storage = getStorage();

  const handleSubmit = async () => {
    // Initialize variables for picture URLs
    let picture1Url = "";
    let picture2Url = "";
    let picture3Url = "";
    let picture4Url = "";
    
    // Function to upload picture to Firebase Storage and get its URL
    const uploadPictureAndGetUrl = async (inputId: string, storagePath: string): Promise<string> => {
      if (inputId === 'picture1' || inputId === 'picture2' || inputId === 'picture3' || inputId === 'picture4') {
        const file = formData.service[inputId as keyof typeof formData.service];
    
        if (typeof file === 'string') {
          // Handle the case where `file` is a string, perhaps a URL
          return file;
        } else if (file instanceof File) {
          const pictureRef = ref(storage, storagePath);
          const reader = new FileReader();
    
          return new Promise<string>((resolve, reject) => {
            reader.onload = async (event) => {
              try {
                if (event.target && event.target.result) {
                  const arrayBuffer = event.target.result as ArrayBuffer;
                  const uint8Array = new Uint8Array(arrayBuffer);
                  const blob = new Blob([uint8Array], { type: file.type });
    
                  await uploadBytes(pictureRef, blob);
                  const downloadURL = await getDownloadURL(pictureRef);
                  resolve(downloadURL);
                } else {
                  console.error("Failed to read the file.");
                  reject("Failed to read the file.");
                }
              } catch (error) {
                console.error("Error uploading picture:", error);
                reject(error);
              }
            };
    
            reader.onerror = (error) => {
              console.error("Error reading file:", error);
              reject(error);
            };
    
            reader.readAsArrayBuffer(file);
          });
        } else {
          console.error(`No file selected for ${inputId}`);
          return "";
        }
      } else {
        console.error(`Invalid inputId '${inputId}'`);
        return "";
      }
    };
    

    // Upload pictures and get their URLs
    picture1Url = await uploadPictureAndGetUrl("picture1", `images/${formData.companyInformation.name}/picture1.jpg`);
    picture2Url = await uploadPictureAndGetUrl("picture2", `images/${formData.companyInformation.name}/picture2.jpg`);
    picture3Url = await uploadPictureAndGetUrl("picture3", `images/${formData.companyInformation.name}/picture3.jpg`);
    picture4Url = await uploadPictureAndGetUrl("picture4", `images/${formData.companyInformation.name}/picture4.jpg`);

    // Handle checkboxes and create an array of selected types
    const selectedTypes = Array.from(document.querySelectorAll('input[name="type"]:checked')).map((checkbox) => (checkbox as HTMLInputElement).value);
    
    const dataToSubmit = {
      name: formData.companyInformation.name,
      address: formData.companyInformation.address,
      postcode: formData.companyInformation.postcode,
      district: formData.companyInformation.district,
      state: formData.companyInformation.state,
      location: formData.companyInformation.location,
      type: formData.service.type,
      description: formData.service.description,
      time: `${formData.service.timeStart} - ${formData.service.timeEnd}`,
      contact: formData.contactUs.contact,
      email: formData.contactUs.email,
      websiteUrl: formData.contactUs.websiteUrl,
      facebookUrl: formData.contactUs.facebookUrl,
      instagramUrl: formData.contactUs.instagramUrl,
      twitterUrl: formData.contactUs.twitterUrl,
      picture1: picture1Url,
      picture2: picture2Url,
      picture3: picture3Url,
      picture4: picture4Url,
    };
  
    // Call the function to add the data to Firebase
    addData(dataToSubmit);
    console.log("formData");

    router.push("/");
  };

  type FormData = {
    companyInformation: {
      name: string;
      address: string;
      postcode: string;
      district: string;
      state: string;
      location: string;
    };
    service: {
      type: string[];
      description: string;
      timeStart: string;
      timeEnd: string;
      picture1: File | null; // Use the appropriate type for picture1
      picture2: File | null; // Use the appropriate type for picture2
      picture3: File | null; // Use the appropriate type for picture3
      picture4: File | null; // Use the appropriate type for picture4
    };
    contactUs: {
      email: string;
      contact: string;
      websiteUrl: string;
      instagramUrl: string;
      twitterUrl: string;
      facebookUrl: string;
    };
  };

  const [activeTab, setActiveTab] = useState('companyInformation'); // Default active tab
  const [formData, setFormData] = useState({
    companyInformation: {
      name: '',
      address: '',
      postcode: '',
      district: '',
      state: '',
      location: '',
    },
    service: {
      type: [] as string[],
      description: '',
      timeStart: '',
      timeEnd: '',
      picture1: '',
      picture2: '',
      picture3: '',
      picture4: '',
    },
    contactUs: {
      email: '',
      contact: '',
      websiteUrl: '',
      instagramUrl: '',
      twitterUrl: '',
      facebookUrl: '',
    },
  });

  const handleInputChange = (tab: keyof FormData, field: string, value: any) => {
    setFormData((prevData) => {
      if (tab === 'service' && (field === 'picture1' || field === 'picture2' || field === 'picture3' || field === 'picture4')) {
        // For picture inputs in the 'service' section
        return {
          ...prevData,
          service: {
            ...prevData.service,
            [field]: value,
          },
        };
      }
  
      if (tab === 'service' && field === 'type') {
        // For checkbox inputs in the 'service' section
        const updatedType = prevData.service.type.includes(value)
          ? prevData.service.type.filter((item) => item !== value)
          : [...prevData.service.type, value];
  
        return {
          ...prevData,
          service: {
            ...prevData.service,
            type: updatedType,
          },
        };
      }
  
      return {
        ...prevData,
        [tab]: {
          ...prevData[tab],
          [field]: value,
        },
      };
    });
  };
  
  
  // Function to switch tabs
  const switchTab = (tabName: string) => {
    setActiveTab(tabName);
  };

  const title =
    "Baiki.com – Your One-Stop Gadget Services Hub in Malaysia!";
  const description =
    "The most comprehensive list for repair services in Malaysia. Find the closest repair centre for you!";

  return (
    <div className="flex flex-col bg-white">
      {/* Header Desktop */}
      <header className="relative z-10 flex items-center p-2" style={{ backgroundColor: "#FF1E26" }}>
        <div className="hidden sm:inline-flex">
          <Link href="/">
            <img
              src="/baiki.png"
              className="h-[50px] md:h-[50px] ml-10"
              alt="Baiki logo"
            />
          </Link>
        </div>

        <div className="hidden md:inline-flex md:space-x-4 ml-10 px-8">
          {/* My Profile */}
          <button className="btn-normal-case">
            <a className="text-white">
              Profil Saya
            </a>
          </button>
        </div>

        <div className="hidden md:inline-flex md:space-x-4 px-8">
          {/* Add Shop */}
          <button className="btn-normal-case">
            <a className="text-white font-semibold">
              Tambah Kedai
            </a>
          </button>
        </div>

        <div className="hidden md:inline-flex md:space-x-4 px-8">
          {/* FAQ */}
          <button className="btn-normal-case">
            <a className="text-white">
              FAQ
            </a>
          </button>
        </div>

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
      <main className="md:mt-4 bg-white">

        {/* desktop view */}
        <div className="mx-auto mb-16 mt-4 hidden max-w-6xl px-4 py-2 md:flex bg-white flex-row">
          <div className="flex flex-col">
            <div className="flex w-full items-center">
              <img 
                src="repair.png"
                className="h-[50px] md:h-[512px]"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex w-full items-center py-1">
              <a className="font-semibold text-4xl">
                Tambah Kedai
              </a>
            </div>
            <div className="flex w-full items-center py-1">
              <a className="font-thin">
                Tambah atau kemaskini maklumat mengenai kedai anda
              </a>
            </div>
            <div className="flex w-full items-center py-4">
              <div className="tab border-solid border-2 mx-auto px-10 text-black rounded-2xl border-gray-500 hover:text-white hover:bg-red-500 active:bg-red-600" onClick={() => switchTab("companyInformation")}>
                <button className="tablinks">
                  Maklumat Kedai
                </button>
              </div>
              <div className="tab border-solid border-2 mx-auto px-10 text-black rounded-2xl border-gray-500 hover:text-white hover:bg-red-500 active:bg-red-600" onClick={() => switchTab("service")}>
                <button className="tablinks">
                  Servis
                </button>
              </div>
              <div className="tab border-solid border-2 mx-auto px-10 text-black rounded-2xl border-gray-500 hover:text-white hover:bg-red-500 active:bg-red-600" onClick={() => switchTab("contactUs")}>
                <button className="tablinks">
                  Hubungi Kami
                </button>
              </div>
            </div>
            {/* Form Sections */}
            {activeTab === 'companyInformation' && (
              <>
                <div className="flex w-full flex-col">
                  <div className="flex flex-row px-4 mb-2">
                    <label htmlFor="name">Nama Kedai</label>
                  </div>
                  <div className="flex flex-row">
                    <input 
                      type="text" 
                      name="name" 
                      id="name" 
                      className="rounded-xl w-full ml-2 required:border-red-500 required:border-2 valid:border-green-500" 
                      placeholder="Cth: Kedai Baiki Kami" 
                      required 
                      value={formData.companyInformation.name} onChange={(e) => handleInputChange('companyInformation', 'name', e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex w-full mt-2 flex-col">
                  <div className="flex flex-row px-4 mb-2">
                    <label htmlFor="address">Alamat</label>
                  </div>
                  <div className="flex flex-row">
                    <input 
                      type="text" 
                      name="address" 
                      id="address" 
                      className="rounded-xl w-full ml-2 required:border-red-500 required:border-2 valid:border-green-500" 
                      placeholder="Cth: Mercu Summer Suites, Jalan Cendana" 
                      required 
                      value={formData.companyInformation.address} onChange={(e) => handleInputChange('companyInformation', 'address', e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex w-full mt-2 flex-col">
                  <div className="flex flex-row px-4 mb-2">
                    <label htmlFor="postcode">Poskod</label>
                  </div>
                  <div className="flex flex-row">
                    <input 
                      type="text" 
                      name="postcode" 
                      id="postcode" 
                      className="rounded-xl w-full ml-2 required:border-red-500 required:border-2 valid:border-green-500" 
                      placeholder="Cth: 50250" 
                      required 
                      value={formData.companyInformation.postcode} onChange={(e) => handleInputChange('companyInformation', 'postcode', e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex w-full mt-2 flex-col">
                  <div className="flex flex-row px-4 mb-2">
                    <label htmlFor="district">Bandar</label>
                  </div>
                  <div className="flex flex-row">
                    <input 
                      type="text" 
                      name="district" 
                      id="district" 
                      className="rounded-xl w-full ml-2 required:border-red-500 required:border-2 valid:border-green-500" 
                      placeholder="Cth: Ampang" 
                      required 
                      value={formData.companyInformation.district} onChange={(e) => handleInputChange('companyInformation', 'district', e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex w-full mt-2 flex-col">
                  <div className="flex flex-row px-4 mb-2">
                    <label htmlFor="state">Negeri</label>
                  </div>
                  <div className="flex flex-row">
                    <input 
                      type="text" 
                      name="state" 
                      id="state" 
                      className="rounded-xl w-full ml-2 required:border-red-500 required:border-2 valid:border-green-500" 
                      placeholder="Cth: Selangor" 
                      required 
                      value={formData.companyInformation.state} onChange={(e) => handleInputChange('companyInformation', 'state', e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex w-full mt-2 flex-col">
                  <div className="flex flex-row px-4 mb-2">
                    <label htmlFor="location">Lokasi</label>
                  </div>
                  <div className="flex flex-row">
                    <input 
                      type="text" 
                      name="location" 
                      id="location" 
                      className="rounded-xl w-full ml-2 required:border-red-500 required:border-2 valid:border-green-500" 
                      placeholder="Cth: 3.158880209637858, 101.70491202420591" 
                      required 
                      value={formData.companyInformation.location} onChange={(e) => handleInputChange('companyInformation', 'location', e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
            {activeTab === 'service' && (
              <>
                <div className="flex w-full flex-col">
                  <div className="flex flex-row px-4 mb-2">
                    <label htmlFor="type">Kategori Gajet</label>
                  </div>
                  <div className="flex flex-row">
                    <input
                      type="checkbox"
                      name="type"
                      value="smartwatch"
                      className="ml-2"
                      checked={formData.service.type.includes('smartwatch')}
                      onChange={() => handleInputChange('service', 'type', 'smartwatch')}
                    />
                    <label htmlFor="type" className="ml-2">
                      Jam Pintar
                    </label>
                  </div>
                  <div className="flex flex-row">
                    <input
                      type="checkbox"
                      name="type"
                      value="laptop"
                      className="ml-2"
                      checked={formData.service.type.includes('laptop')}
                      onChange={() => handleInputChange('service', 'type', 'laptop')}
                    />
                    <label htmlFor="type" className="ml-2">
                      Komputer Riba
                    </label>
                  </div>
                  <div className="flex flex-row">
                    <input
                      type="checkbox"
                      name="type"
                      value="camera"
                      className="ml-2"
                      checked={formData.service.type.includes('camera')}
                      onChange={() => handleInputChange('service', 'type', 'camera')}
                    />
                    <label htmlFor="type" className="ml-2">
                      Kamera
                    </label>
                  </div>
                  <div className="flex flex-row">
                    <input
                      type="checkbox"
                      name="type"
                      value="accessory"
                      className="ml-2"
                      checked={formData.service.type.includes('accessory')}
                      onChange={() => handleInputChange('service', 'type', 'accessory')}
                    />
                    <label htmlFor="type" className="ml-2">
                      Aksesori
                    </label>
                  </div>
                </div>
                <div className="flex w-full mt-2 flex-col">
                  <div className="flex flex-row px-4 mb-2">
                    <label htmlFor="description">Deskripsi Servis</label>
                  </div>
                  <div className="flex flex-row">
                    <input
                      type="text"
                      name="description"
                      id="description"
                      className="rounded-xl w-full ml-2 required:border-red-500 required:border-2 valid:border-green-500"
                      placeholder="Cth: Kedai Baiki Kami"
                      value={formData.service.description}
                      onChange={(e) => handleInputChange('service', 'description', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="flex w-full mt-2 flex-col">
                  <div className="flex flex-row px-4 mb-2">
                    <label htmlFor="time">Masa Operasi</label>
                  </div>
                  <div className="flex flex-row">
                    <input
                      type="time"
                      name="time"
                      id="timeStart"
                      className="rounded-xl w-full ml-2 required:border-red-500 required:border-2 valid:border-green-500"
                      value={formData.service.timeStart}
                      onChange={(e) => handleInputChange('service', 'timeStart', e.target.value)}
                      required
                    />
                    <input
                      type="time"
                      name="time"
                      id="timeEnd"
                      className="rounded-xl w-full ml-2 required:border-red-500 required:border-2 valid:border-green-500"
                      value={formData.service.timeEnd}
                      onChange={(e) => handleInputChange('service', 'timeEnd', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="flex w-full items-center mt-2">
                  <label htmlFor="picture1">Picture 1: </label>
                  <input
                    type="file"
                    name="picture1"
                    id="picture1"
                    className="ml-2"
                    accept="image/*"
                    onChange={(e) => handleInputChange('service', 'picture1', e.target.files?.[0])}
                  />
                </div>
                <div className="flex w-full items-center mt-2">
                  <label htmlFor="picture2">Picture 2: </label>
                  <input
                    type="file"
                    name="picture2"
                    id="picture2"
                    className="ml-2"
                    accept="image/*"
                    onChange={(e) => handleInputChange('service', 'picture2', e.target.files?.[0])}
                  />
                </div>
                <div className="flex w-full items-center mt-2">
                  <label htmlFor="picture3">Picture 3: </label>
                  <input
                    type="file"
                    name="picture3"
                    id="picture3"
                    className="ml-2"
                    accept="image/*"
                    onChange={(e) => handleInputChange('service', 'picture3', e.target.files?.[0])}
                  />
                </div>
                <div className="flex w-full items-center mt-2">
                  <label htmlFor="picture4">Picture 4: </label>
                  <input
                    type="file"
                    name="picture4"
                    id="picture4"
                    className="ml-2"
                    accept="image/*"
                    onChange={(e) => handleInputChange('service', 'picture4', e.target.files?.[0])}
                  />
                </div>
              </>
            )}
            {activeTab === 'contactUs' && (
              <>
                <div className="flex w-full flex-col">
                  <div className="flex flex-row px-4 mb-2">
                    <label htmlFor="email">Emel</label>
                  </div>
                  <div className="flex flex-row">
                    <input 
                      type="email" 
                      name="email" 
                      id="email" 
                      className="rounded-xl w-full ml-2 required:border-red-500 required:border-2 valid:border-green-500" 
                      placeholder="Cth: amanz@dev.my" 
                      required 
                      value={formData.contactUs.email} 
                      onChange={(e) => handleInputChange('contactUs', 'email', e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex w-full mt-2 flex-col">
                  <div className="flex flex-row px-4 mb-2">
                    <label htmlFor="contact">Nombor Telefon</label>
                  </div>
                  <div className="flex flex-row">
                    <input 
                      type="tel" 
                      name="contact" 
                      id="contact" 
                      className="rounded-xl w-full ml-2 required:border-red-500 required:border-2 valid:border-green-500" 
                      placeholder="Cth: 0123456789" 
                      required 
                      value={formData.contactUs.contact} 
                      onChange={(e) => handleInputChange('contactUs', 'contact', e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex w-full mt-2 flex-col">
                  <div className="flex flex-row px-4 mb-2">
                    <label htmlFor="websiteUrl">Website</label>
                  </div>
                  <div className="flex flex-row">
                    <input 
                      type="text" 
                      name="websiteUrl" 
                      id="websiteUrl" 
                      className="rounded-xl w-full ml-2" 
                      placeholder="Cth: https://amanz.my/" 
                      value={formData.contactUs.websiteUrl} 
                      onChange={(e) => handleInputChange('contactUs', 'websiteUrl', e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex w-full mt-2 flex-col">
                  <div className="flex flex-col px-4 mb-2">
                    <label htmlFor="instagramUrl">Instagram: </label>
                  </div>
                  <div className="flex flex-row">
                    <input 
                      type="text" 
                      name="instagramUrl" 
                      id="instagramUrl" 
                      className="rounded-xl w-full ml-2" 
                      placeholder="Cth: https://www.instagram.com/amanz.my/" 
                      value={formData.contactUs.instagramUrl} 
                      onChange={(e) => handleInputChange('contactUs', 'instagramUrl', e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex w-full mt-2 flex-col">
                  <div className="flex flex-row px-4 mb-2">
                    <label htmlFor="twitterUrl">Twitter: </label>
                  </div>
                  <div className="flex flex-row">
                    <input 
                      type="text" 
                      name="twitterUrl" 
                      id="twitterUrl" 
                      className="rounded-xl w-full ml-2" 
                      placeholder="Cth: https://twitter.com/amanz" 
                      value={formData.contactUs.twitterUrl} 
                      onChange={(e) => handleInputChange('contactUs', 'twitterUrl', e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex w-full mt-2 flex-col">
                  <div className="flex flex-row px-4 mb-2">
                    <label htmlFor="facebookUrl">Facebook: </label>
                  </div>
                  <div className="flex flex-row">
                    <input 
                      type="text" 
                      name="facebookUrl" 
                      id="facebookUrl" 
                      className="rounded-xl w-full ml-2" 
                      placeholder="Cth: https://www.facebook.com/AmanzNetwork/" 
                      value={formData.contactUs.facebookUrl} 
                      onChange={(e) => handleInputChange('contactUs', 'facebookUrl', e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
            <div className="flex md:inline-flex md:space-x-4 mt-2">
              <button className="inline-block rounded bg-red-500 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-blue-red focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-red-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]" 
              onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* mobile view */}
        <div className="mx-4 mb-16 mt-6 flex flex-col space-y-2 md:hidden">
          <div className="flex w-full items-center">
            <label htmlFor="name">Name: </label>
            <input type="text" name="name" id="mobile_name" className="rounded-xl w-full ml-2">
            </input>
          </div>
          <div className="flex w-full items-center">
            <label htmlFor="address">Address: </label>
            <input type="text" name="address" id="mobile_address" className="rounded-xl w-full ml-2">
            </input>
          </div>
          <div className="flex w-full items-center">
            <label htmlFor="postcode">Postcode: </label>
            <input type="text" name="postcode" id="mobile_postcode" className="rounded-xl w-full ml-2">
            </input>
          </div>
          <div className="flex w-full items-center mt-2">
            <label htmlFor="district">District: </label>
            <input type="text" name="district" id="mobile_district" className="rounded-xl w-full ml-2">
            </input>
          </div>
          <div className="flex w-full items-center mt-2">
            <label htmlFor="state">State: </label>
            <input type="text" name="state" id="mobile_state" className="rounded-xl w-full ml-2">
            </input>
          </div>
          <div className="flex w-full items-center mt-2">
            <label htmlFor="location">Location: </label>
            <input type="text" name="location" id="mobile_location" className="rounded-xl w-full ml-2">
            </input>
          </div>
          <div className="flex w-full items-center mt-2">
            <label htmlFor="description">Description: </label>
            <input type="text" name="description" id="mobile_description" className="rounded-xl w-full ml-2">
            </input>
          </div>
          <div className="flex w-full items-center mt-2">
            <label htmlFor="type">Type: </label>
          </div>
          <div className="flex w-full items-center mt-2 justify-center">
            <input type="checkbox" name="type" value="smartphone" className="ml-2"></input>
            <label htmlFor="type" className="ml-2">Telefon Pintar</label>
            <input type="checkbox" name="type" value="smartwatch" className="ml-2"></input>
            <label htmlFor="type" className="ml-2">Jam Pintar</label>
            <input type="checkbox" name="type" value="laptop" className="ml-2"></input>
            <label htmlFor="type" className="ml-2">Komputer Riba</label>
          </div>
          <div className="flex w-full items-center mt-2 justify-center">
            <input type="checkbox" name="type" value="camera" className="ml-2"></input>
            <label htmlFor="type" className="ml-2">Kamera</label>
            <input type="checkbox" name="type" value="accessory" className="ml-2"></input>
            <label htmlFor="type" className="ml-2">Aksesori</label>
          </div>
          <div className="flex w-full items-center mt-2">
            <label htmlFor="time">Time: </label>
            <input type="time" name="time" id="mobile_timeStart" className="rounded-xl w-full ml-2">
            </input>
            <input type="time" name="time" id="mobile_timeEnd" className="rounded-xl w-full ml-2">
            </input>
          </div>
          <div className="flex w-full items-center mt-2">
            <label htmlFor="contact">Contact: </label>
            <input type="tel" name="contact" id="mobile_contact" className="rounded-xl w-full ml-2">
            </input>
          </div>
          <div className="flex w-full items-center mt-2">
            <label htmlFor="websiteUrl">Website: </label>
            <input type="text" name="websiteUrl" id="mobile_websiteUrl" className="rounded-xl w-full ml-2">
            </input>
          </div>
          <div className="flex w-full items-center mt-2">
            <label htmlFor="facebookUrl">Facebook: </label>
            <input type="text" name="facebookUrl" id="mobile_facebookUrl" className="rounded-xl w-full ml-2">
            </input>
          </div>
          <div className="flex w-full items-center mt-2">
            <label htmlFor="instagramUrl">Instagram: </label>
            <input type="text" name="instagramUrl" id="mobile_instagramUrl" className="rounded-xl w-full ml-2">
            </input>
          </div>
          <div className="flex w-full items-center mt-2">
            <label htmlFor="twitterUrl">Twitter: </label>
            <input type="text" name="twitterUrl" id="mobile_twitterUrl" className="rounded-xl w-full ml-2">
            </input>
          </div>
          <div className="flex w-full items-center mt-2">
            <label htmlFor="picture1">Picture 1: </label>
            <input type="file" name="picture1" id="mobile_picture1" className="ml-2" accept="image/*">
            </input>
          </div>
          <div className="flex w-full items-center mt-2">
            <label htmlFor="picture2">Picture 2: </label>
            <input type="file" name="picture2" id="mobile_picture2" className="ml-2" accept="image/*">
            </input>
          </div>
          <div className="flex w-full items-center mt-2">
            <label htmlFor="picture3">Picture 3: </label>
            <input type="file" name="picture3" id="mobile_picture3" className="ml-2" accept="image/*">
            </input>
          </div>
          <div className="flex w-full items-center mt-2">
            <label htmlFor="picture4">Picture 4: </label>
            <input type="file" name="picture4" id="mobile_picture4" className="ml-2" accept="image/*">
            </input>
          </div>
          <div className="flex md:inline-flex md:space-x-4 mt-2">
            <button className="inline-block rounded bg-red-500 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-blue-red focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-red-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]" 
            onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}