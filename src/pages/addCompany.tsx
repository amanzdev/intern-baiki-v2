import SEOHead from "@/components/SEOHead";
import Link from "next/link";
import { addData } from "../../backend/firebase";
import { useRouter } from "next/router";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getStorage } from "firebase/storage";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const storage = getStorage();
  const [hasCheckboxWarning, setCheckboxWarning] = useState(false);

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
    
    // Check for errors before submitting
    if (
      !formData.companyInformation.name ||
      !formData.companyInformation.address ||
      !formData.companyInformation.postcode ||
      !formData.companyInformation.district ||
      !formData.companyInformation.state ||
      !formData.companyInformation.location ||
      formData.service.type.length === 0 || // Check if at least one checkbox is selected
      !formData.service.description ||
      !formData.service.timeStart ||
      !formData.service.timeEnd ||
      !formData.contactUs.contact ||
      !formData.contactUs.email
      ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        companyInformation: {
          ...prevErrors.companyInformation,
          name: "Nama diperlukan",
          address: "Alamat diperlukan",
          postcode: "Poskod diperlukan",
          district: "Bandar diperlukan",
          state: "Negeri diperlukan",
          location: "Lokasi diperlukan",
        },
        service: {
          ...prevErrors.service,
          type: ["Pilih sekurang-kurangnya satu"],
          description: "Deskripsi diperlukan",
          timeStart: "Masa diperlukan",
          timeEnd: "Masa diperlukan",
        },
        contactUs: {
          ...prevErrors.contactUs,
          contact: "Nombor telefon diperlukan",
          email: "Emel diperlukan",
        }
      }));
      return; // Prevent submission
    }

    // Check if at least one checkbox is selected
    const hasSelectedCheckbox = formData.service.type.length > 0;

    if (!hasSelectedCheckbox) {
      // Set the warning state
      setCheckboxWarning(true);

      // You can also set an error message in your errors state if needed
      setErrors((prevErrors) => ({
        ...prevErrors,
        service: {
          ...prevErrors.service,
          type: [], // Set it as an empty array
        },
      }));
    } else {
      // Reset the warning state if at least one checkbox is selected
      setCheckboxWarning(false);

      // Proceed with form submission
      // ...
    }

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

  const [errors, setErrors] = useState({
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

  const handleBlur = (tab: keyof FormData, field: string) => {
    // Check for errors when the input loses focus
    if (!formData[tab as keyof FormData][field as keyof FormData[keyof FormData]]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [tab]: {
          ...prevErrors[tab as keyof typeof prevErrors],
          [field]: "Required",
        },
      }));
    }
  };

  const handleInputChange = (tab: keyof FormData, field: string, value: any) => {
    setFormData((prevData) => {
      if (tab === 'companyInformation' && field === 'postcode') {
        // Check if the value is a 5-digit number using a regular expression
        if (/^\d{5}$/.test(value)) {
          // Valid 5-digit number
        } else {
          // Invalid, show an error message
          setErrors((prevErrors) => ({
            ...prevErrors,
            [tab]: {
              ...prevErrors[tab],
              [field]: value,
            },
          }));
        }
      }

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
        const updatedType = prevData.service.type.includes(value)
          ? prevData.service.type.filter((item) => item !== value)
          : [...prevData.service.type, value];

        // Check if at least one checkbox is selected
        const hasSelectedCheckbox = updatedType.length > 0;

        // Update checkbox errors based on the selected state
        setErrors((prevErrors) => ({
          ...prevErrors,
          service: {
            ...prevErrors.service,
            type: hasSelectedCheckbox ? [] : ["Pilih sekurang-kurangnya satu"],
          },
        }));

        // Set the warning state
        setCheckboxWarning(!hasSelectedCheckbox);

        return {
          ...prevData,
          service: {
            ...prevData.service,
            type: updatedType,
          },
        };
      }

      if (tab === 'contactUs' && field === 'email') {
        // Check if the value is a valid email address
        if (/^\S+@\S+\.\S+$/.test(value)) {
          // Valid email address
        } else {
          // Invalid, show an error message
          setErrors((prevErrors) => ({
            ...prevErrors,
            [tab]: {
              ...prevErrors[tab],
              [field]: "Invalid email address",
            },
          }));
        }
      }

      if (tab === 'contactUs' && field === 'contact') {
      // Check if the value is a 10 or 11-digit number using a regular expression
      if (/^\d{10,11}$/.test(value)) {
        // Valid 10-11 digit number
      } else {
        // Invalid, show an error message
        setErrors((prevErrors) => ({
          ...prevErrors,
          [tab]: {
            ...prevErrors[tab],
            [field]: value,
          },
        }));
      }
    }
  
      return {
        ...prevData,
        [tab]: {
          ...prevData[tab],
          [field]: value,
        },
      };
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [tab]: {
        ...prevErrors[tab],
        [field]: "", // Clear the error message
      },
    }));
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
        <div className="md:hidden">
          <Link href="/">
            <img
              src="/baiki.png"
              className="h-[50px] md:h-[50px]"
              alt="Baiki logo"
            />
          </Link>
        </div>

        <div className="md:hidden space-x-4 ml-2 px-4">
          {/* My Profile */}
          <button className="btn-normal-case">
            <a className="text-white">
              Profil Saya
            </a>
          </button>
        </div>

        <div className="md:hidden space-x-4 px-4">
          {/* Add Shop */}
          <button className="btn-normal-case">
            <a className="text-white font-semibold">
              Tambah Kedai
            </a>
          </button>
        </div>

        <div className="md:hidden space-x-4 px-4">
          {/* FAQ */}
          <button className="btn-normal-case">
            <a className="text-white">
              FAQ
            </a>
          </button>
        </div>
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
            <div
              className={`tab border-solid border-2 mx-auto px-10 text-black rounded-2xl border-gray-500 hover:text-white hover:bg-red-500 active:bg-red-600 ${activeTab === "companyInformation" ? "bg-red-500 text-white" : ""}`}
              onClick={() => switchTab("companyInformation")}
              >
                <button className="tablinks">
                  Maklumat Kedai
                </button>
              </div>
              <div 
                className={`tab border-solid border-2 mx-auto px-10 text-black rounded-2xl border-gray-500 hover:text-white hover:bg-red-500 active:bg-red-600 ${activeTab === "service" ? "bg-red-500 text-white" : ""}`}
                onClick={() => switchTab("service")}
                >
                  <button className="tablinks">
                    Servis
                  </button>
              </div>
              <div 
                className={`tab border-solid border-2 mx-auto px-10 text-black rounded-2xl border-gray-500 hover:text-white hover:bg-red-500 active:bg-red-600 ${activeTab === "contactUs" ? "bg-red-500 text-white" : ""}`}
                onClick={() => switchTab("contactUs")}
                >
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
                      className={`rounded-xl w-full ml-2 ${
                        errors.companyInformation.name && "border-red-500 border-2" // Add red border on error
                      }`}
                      placeholder="Cth: Kedai Baiki Kami" 
                      required 
                      value={formData.companyInformation.name} 
                      onBlur={() => handleBlur("companyInformation", "name")} // Validate when input loses focus
                      onChange={(e) => handleInputChange('companyInformation', 'name', e.target.value)}
                    />
                  </div>
                  {errors.companyInformation.name && (
                    <p className="text-red-500 px-4">Nama diperlukan</p> // Show error message
                  )}
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
                      className={`rounded-xl w-full ml-2 ${
                        errors.companyInformation.address && "border-red-500 border-2" // Add red border on error
                      }`}
                      placeholder="Cth: Mercu Summer Suites, Jalan Cendana" 
                      required 
                      value={formData.companyInformation.address} 
                      onBlur={() => handleBlur("companyInformation", "address")} // Validate when input loses focus
                      onChange={(e) => handleInputChange('companyInformation', 'address', e.target.value)}
                    />
                  </div>
                  {errors.companyInformation.address && (
                    <p className="text-red-500 px-4">Alamat diperlukan</p> // Show error message
                  )}
                </div>
                <div className="flex flex-row">
                  <div className="flex w-full mt-2 flex-col">
                    <div className="flex flex-row px-4 mb-2">
                      <label htmlFor="postcode">Poskod</label>
                    </div>
                    <div className="flex flex-row">
                      <input 
                        type="text" 
                        name="postcode" 
                        id="postcode" 
                        className={`rounded-xl w-full ml-2 ${
                          errors.companyInformation.postcode && "border-red-500 border-2" // Add red border on error
                        }`}
                        placeholder="Cth: 50250" 
                        required 
                        value={formData.companyInformation.postcode} 
                        onBlur={() => handleBlur("companyInformation", "postcode")} // Validate when input loses focus
                        onChange={(e) => handleInputChange('companyInformation', 'postcode', e.target.value)}
                      />
                    </div>
                    {errors.companyInformation.postcode && (
                      <p className="text-red-500 px-4">5 digit poskod diperlukan</p> // Show error message
                    )}
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
                        className={`rounded-xl w-full ml-2 ${
                          errors.companyInformation.district && "border-red-500 border-2" // Add red border on error
                        }`}
                        placeholder="Cth: Ampang" 
                        required 
                        value={formData.companyInformation.district} 
                        onBlur={() => handleBlur("companyInformation", "district")} // Validate when input loses focus
                        onChange={(e) => handleInputChange('companyInformation', 'district', e.target.value)}
                      />
                    </div>
                    {errors.companyInformation.district && (
                      <p className="text-red-500 px-4">Bandar diperlukan</p> // Show error message
                    )}
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
                      className={`rounded-xl w-full ml-2 ${
                        errors.companyInformation.state && "border-red-500 border-2" // Add red border on error
                      }`}
                      placeholder="Cth: Selangor" 
                      required 
                      value={formData.companyInformation.state} 
                      onBlur={() => handleBlur("companyInformation", "state")} // Validate when input loses focus
                      onChange={(e) => handleInputChange('companyInformation', 'state', e.target.value)}
                    />
                  </div>
                  {errors.companyInformation.state && (
                    <p className="text-red-500 px-4">Negeri diperlukan</p> // Show error message
                  )}
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
                      className={`rounded-xl w-full ml-2 ${
                        errors.companyInformation.location && "border-red-500 border-2" // Add red border on error
                      }`}
                      placeholder="Cth: 3.158880209637858, 101.70491202420591" 
                      required 
                      value={formData.companyInformation.location} 
                      onBlur={() => handleBlur("companyInformation", "location")} // Validate when input loses focus
                      onChange={(e) => handleInputChange('companyInformation', 'location', e.target.value)}
                    />
                  </div>
                  {errors.companyInformation.location && (
                    <p className="text-red-500 px-4">Lokasi diperlukan</p> // Show error message
                  )}
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
                  {errors.service.type.length > 0 && 
                    <p className="text-red-500 px-4">Pilih sekurang-kurangnya satu</p>
                  }
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
                      className={`rounded-xl w-full ml-2 ${
                        errors.service.description && "border-red-500 border-2" // Add red border on error
                      }`}
                      placeholder="Cth: Kedai Baiki Kami"
                      value={formData.service.description}
                      onBlur={() => handleBlur("service", "description")} // Validate when input loses focus
                      onChange={(e) => handleInputChange('service', 'description', e.target.value)}
                      required
                    />
                  </div>
                  {errors.service.description && (
                    <p className="text-red-500 px-4">Deskripsi diperlukan</p> // Show error message
                  )}
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
                      className={`rounded-xl w-full ml-2 ${
                        errors.service.timeStart && "border-red-500 border-2" // Add red border on error
                      }`}
                      value={formData.service.timeStart}
                      onBlur={() => handleBlur("service", "timeStart")} // Validate when input loses focus
                      onChange={(e) => handleInputChange('service', 'timeStart', e.target.value)}
                      required
                    />
                    <input
                      type="time"
                      name="time"
                      id="timeEnd"
                      className={`rounded-xl w-full ml-2 ${
                        errors.service.timeEnd && "border-red-500 border-2" // Add red border on error
                      }`}
                      value={formData.service.timeEnd}
                      onBlur={() => handleBlur("service", "timeEnd")} // Validate when input loses focus
                      onChange={(e) => handleInputChange('service', 'timeEnd', e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-row">
                    <div className="flex flex-row w-full">
                      {errors.service.timeStart && (
                        <p className="text-red-500 px-4">Masa diperlukan</p> // Show error message
                      )}
                    </div>
                    <div className="flex flex-row w-full">
                      {errors.service.timeEnd && (
                        <p className="text-red-500 px-4">Masa diperlukan</p> // Show error message
                      )}
                    </div>
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
                <div className="flex flex-row">
                  <div className="flex w-full flex-col">
                    <div className="flex flex-row px-4 mb-2">
                      <label htmlFor="email">Emel</label>
                    </div>
                    <div className="flex flex-row">
                      <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        className={`rounded-xl w-full ml-2 ${
                          errors.contactUs.email && "border-red-500 border-2" // Add red border on error
                        }`}
                        placeholder="Cth: amanz@dev.my" 
                        required 
                        value={formData.contactUs.email} 
                        onBlur={() => handleBlur("contactUs", "email")} // Validate when input loses focus
                        onChange={(e) => handleInputChange('contactUs', 'email', e.target.value)}
                      />
                    </div>
                    {errors.contactUs.email && (
                      <p className="text-red-500 px-4">Emel diperlukan</p> // Show error message
                    )}
                  </div>
                  <div className="flex w-full flex-col">
                    <div className="flex flex-row px-4 mb-2">
                      <label htmlFor="contact">Nombor Telefon</label>
                    </div>
                    <div className="flex flex-row">
                      <input 
                        type="tel" 
                        name="contact" 
                        id="contact" 
                        className={`rounded-xl w-full ml-2 ${
                          errors.contactUs.contact && "border-red-500 border-2" // Add red border on error
                        }`}
                        placeholder="Cth: 0123456789" 
                        required 
                        value={formData.contactUs.contact} 
                        onBlur={() => handleBlur("contactUs", "contact")} // Validate when input loses focus
                        onChange={(e) => handleInputChange('contactUs', 'contact', e.target.value)}
                      />
                    </div>
                    {errors.contactUs.contact && (
                      <p className="text-red-500 px-4">Nombor telefon diperlukan</p> // Show error message
                    )}
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
                Simpan
              </button>
            </div>
          </div>
        </div>

        {/* mobile view */}
        <div className="mx-auto mb-16 mt-4 max-w-6xl px-4 py-2 md:hidden bg-white flex-row">
          <div className="flex flex-col">
            <div className="flex w-full items-center py-1">
              <a className="font-semibold text-2xl">
                Tambah Kedai
              </a>
            </div>
            <div className="flex w-full items-center py-1">
              <a className="font-thin text-sm">
                Tambah atau kemaskini maklumat mengenai kedai anda
              </a>
            </div>
            <div className="flex w-full items-center py-4">
              <div
                className={`tab border-solid border-2 mx-auto px-4 text-xs text-black rounded-2xl border-gray-500 hover:text-white hover:bg-red-500 active:bg-red-600 ${activeTab === "companyInformation" ? "bg-red-500 text-white" : ""}`}
                onClick={() => switchTab("companyInformation")}
                >
                  <button className="tablinks">
                    Maklumat Kedai
                  </button>
              </div>
              <div 
                className={`tab border-solid border-2 mx-auto px-4 text-xs text-black rounded-2xl border-gray-500 hover:text-white hover:bg-red-500 active:bg-red-600 ${activeTab === "service" ? "bg-red-500 text-white" : ""}`}
                onClick={() => switchTab("service")}
                >
                  <button className="tablinks">
                    Servis
                  </button>
              </div>
              <div 
                className={`tab border-solid border-2 mx-auto px-4 text-xs text-black rounded-2xl border-gray-500 hover:text-white hover:bg-red-500 active:bg-red-600 ${activeTab === "contactUs" ? "bg-red-500 text-white" : ""}`}
                onClick={() => switchTab("contactUs")}
                >
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
                      className={`rounded-xl w-full ml-1 ${
                        errors.companyInformation.name && "border-red-500 border-2" // Add red border on error
                      }`}
                      placeholder="Kedai Baiki Kami" 
                      required 
                      value={formData.companyInformation.name} 
                      onBlur={() => handleBlur("companyInformation", "name")} // Validate when input loses focus
                      onChange={(e) => handleInputChange('companyInformation', 'name', e.target.value)}
                    />
                  </div>
                  {errors.companyInformation.name && (
                    <p className="text-red-500 px-4">Nama diperlukan</p> // Show error message
                  )}
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
                      className={`rounded-xl w-full ml-1 ${
                        errors.companyInformation.address && "border-red-500 border-2" // Add red border on error
                      }`}
                      placeholder="Mercu Summer Suites, Jalan Cendana" 
                      required 
                      value={formData.companyInformation.address} 
                      onBlur={() => handleBlur("companyInformation", "address")} // Validate when input loses focus
                      onChange={(e) => handleInputChange('companyInformation', 'address', e.target.value)}
                    />
                  </div>
                  {errors.companyInformation.address && (
                    <p className="text-red-500 px-4">Alamat diperlukan</p> // Show error message
                  )}
                </div>
                <div className="flex flex-row">
                  <div className="flex w-full mt-2 flex-col">
                    <div className="flex flex-row px-4 mb-2">
                      <label htmlFor="postcode">Poskod</label>
                    </div>
                    <div className="flex flex-row">
                      <input 
                        type="text" 
                        name="postcode" 
                        id="postcode" 
                        className={`rounded-xl w-full ml-1 ${
                          errors.companyInformation.postcode && "border-red-500 border-2" // Add red border on error
                        }`}
                        placeholder="50250" 
                        required 
                        value={formData.companyInformation.postcode} 
                        onBlur={() => handleBlur("companyInformation", "postcode")} // Validate when input loses focus
                        onChange={(e) => handleInputChange('companyInformation', 'postcode', e.target.value)}
                      />
                    </div>
                    {errors.companyInformation.postcode && (
                      <p className="text-red-500 px-4">5 digit poskod diperlukan</p> // Show error message
                    )}
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
                        className={`rounded-xl w-full ml-1 ${
                          errors.companyInformation.district && "border-red-500 border-2" // Add red border on error
                        }`}
                        placeholder="Ampang" 
                        required 
                        value={formData.companyInformation.district} 
                        onBlur={() => handleBlur("companyInformation", "district")} // Validate when input loses focus
                        onChange={(e) => handleInputChange('companyInformation', 'district', e.target.value)}
                      />
                    </div>
                    {errors.companyInformation.district && (
                      <p className="text-red-500 px-4">Bandar diperlukan</p> // Show error message
                    )}
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
                      className={`rounded-xl w-full ml-1 ${
                        errors.companyInformation.state && "border-red-500 border-2" // Add red border on error
                      }`}
                      placeholder="Selangor" 
                      required 
                      value={formData.companyInformation.state} 
                      onBlur={() => handleBlur("companyInformation", "state")} // Validate when input loses focus
                      onChange={(e) => handleInputChange('companyInformation', 'state', e.target.value)}
                    />
                  </div>
                  {errors.companyInformation.state && (
                    <p className="text-red-500 px-4">Negeri diperlukan</p> // Show error message
                  )}
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
                      className={`rounded-xl w-full ml-1 ${
                        errors.companyInformation.location && "border-red-500 border-2" // Add red border on error
                      }`}
                      placeholder="3.158880209637858, 101.70491202420591" 
                      required 
                      value={formData.companyInformation.location} 
                      onBlur={() => handleBlur("companyInformation", "location")} // Validate when input loses focus
                      onChange={(e) => handleInputChange('companyInformation', 'location', e.target.value)}
                    />
                  </div>
                  {errors.companyInformation.location && (
                    <p className="text-red-500 px-4">Lokasi diperlukan</p> // Show error message
                  )}
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
                  {errors.service.type.length > 0 && 
                    <p className="text-red-500 px-4">Pilih sekurang-kurangnya satu</p>
                  }
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
                      className={`rounded-xl w-full ml-1 ${
                        errors.service.description && "border-red-500 border-2" // Add red border on error
                      }`}
                      placeholder="Kedai Baiki Kami"
                      value={formData.service.description}
                      onBlur={() => handleBlur("service", "description")} // Validate when input loses focus
                      onChange={(e) => handleInputChange('service', 'description', e.target.value)}
                      required
                    />
                  </div>
                  {errors.service.description && (
                    <p className="text-red-500 px-4">Deskripsi diperlukan</p> // Show error message
                  )}
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
                      className={`rounded-xl w-full ml-1 ${
                        errors.service.timeStart && "border-red-500 border-2" // Add red border on error
                      }`}
                      value={formData.service.timeStart}
                      onBlur={() => handleBlur("service", "timeStart")} // Validate when input loses focus
                      onChange={(e) => handleInputChange('service', 'timeStart', e.target.value)}
                      required
                    />
                    <input
                      type="time"
                      name="time"
                      id="timeEnd"
                      className={`rounded-xl w-full ml-1 ${
                        errors.service.timeEnd && "border-red-500 border-2" // Add red border on error
                      }`}
                      value={formData.service.timeEnd}
                      onBlur={() => handleBlur("service", "timeEnd")} // Validate when input loses focus
                      onChange={(e) => handleInputChange('service', 'timeEnd', e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-row">
                    <div className="flex flex-row w-full">
                      {errors.service.timeStart && (
                        <p className="text-red-500 px-4">Masa diperlukan</p> // Show error message
                      )}
                    </div>
                    <div className="flex flex-row w-full">
                      {errors.service.timeEnd && (
                        <p className="text-red-500 px-4">Masa diperlukan</p> // Show error message
                      )}
                    </div>
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
                <div className="flex flex-row">
                  <div className="flex w-full flex-col">
                    <div className="flex flex-row px-4 mb-2">
                      <label htmlFor="email">Emel</label>
                    </div>
                    <div className="flex flex-row">
                      <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        className={`rounded-xl w-full ml-1 ${
                          errors.contactUs.email && "border-red-500 border-2" // Add red border on error
                        }`}
                        placeholder="amanz@dev.my" 
                        required 
                        value={formData.contactUs.email} 
                        onBlur={() => handleBlur("contactUs", "email")} // Validate when input loses focus
                        onChange={(e) => handleInputChange('contactUs', 'email', e.target.value)}
                      />
                    </div>
                    {errors.contactUs.email && (
                      <p className="text-red-500 px-4">Emel diperlukan</p> // Show error message
                    )}
                  </div>
                  <div className="flex w-full flex-col">
                    <div className="flex flex-row px-4 mb-2">
                      <label htmlFor="contact">Nombor Telefon</label>
                    </div>
                    <div className="flex flex-row">
                      <input 
                        type="tel" 
                        name="contact" 
                        id="contact" 
                        className={`rounded-xl w-full ml-1 ${
                          errors.contactUs.contact && "border-red-500 border-2" // Add red border on error
                        }`}
                        placeholder="0123456789" 
                        required 
                        value={formData.contactUs.contact} 
                        onBlur={() => handleBlur("contactUs", "contact")} // Validate when input loses focus
                        onChange={(e) => handleInputChange('contactUs', 'contact', e.target.value)}
                      />
                    </div>
                    {errors.contactUs.contact && (
                      <p className="text-red-500 px-4">Nombor telefon diperlukan</p> // Show error message
                    )}
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
                      className="rounded-xl w-full ml-1" 
                      placeholder="https://amanz.my/" 
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
                      className="rounded-xl w-full ml-1" 
                      placeholder="https://www.instagram.com/amanz.my/" 
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
                      className="rounded-xl w-full ml-1" 
                      placeholder="https://twitter.com/amanz" 
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
                      className="rounded-xl w-full ml-1" 
                      placeholder="https://www.facebook.com/AmanzNetwork/" 
                      value={formData.contactUs.facebookUrl} 
                      onChange={(e) => handleInputChange('contactUs', 'facebookUrl', e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
            {/* Submit Button */}
            <div className="flex items-center mt-4">
              <button className="w-full py-2 text-center bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={handleSubmit}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}