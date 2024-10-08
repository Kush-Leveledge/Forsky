
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import Link from "next/link"
import Image from "next/image"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { SetStateAction, SVGProps, useEffect, useState } from "react"
import { JSX } from "react/jsx-runtime"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { ListFilter, PlusCircle, MoreHorizontal, File, FilePenIcon, TrashIcon, TagIcon } from "lucide-react"
import { Badge } from "../ui/badge"
import { jwtDecode, JwtPayload } from "jwt-decode";
// import img from "../../../../uploads/1723971355144.jpg"

interface custompayload extends JwtPayload {
  user_id: string
}
import {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,

} from "@/components/ui/dialog"
import { Skeleton } from "../ui/skeleton"
import { useNavigate } from "react-router-dom"
import axios from "axios"
// Define the Diamond type
interface Diamonds {
  diamond_id: number;
  shape: string;
  color: string;
  clarity: string;
  certificate: 'GIA' | 'IGI' | 'HRD' | 'SGL' | 'FM' | 'GCAL' | 'GSI' | 'Other';
  fluorescence?: string;
  make?: string;
  cut?: string;
  polish?: string;
  symmetry?: string;
  table_percentage: number;
  depth_percentage: number;
  length_mm: number;
  width_mm: number;
  depth_mm: number;
  price: number;
}

interface Plates {
  id: number;
  plate_id: string;
  size: string;  // e.g., "10x10 mm"
  diameter: string;  // e.g., "50.000"
  thickness: string;  // e.g., "0.500"
  carat_weight_ea: string;  // e.g., "1.2345"
  plate_type: string;  // e.g., "CVD"
  material: string;  // e.g., "Diamond"
  price: number
}

interface Product {
  product_id: number;
  name: string;
  description: string;  // e.g., "10x10 mm"
  price: string;  // e.g., "50.000"
  category_name: string;  // e.g., "0.500"
  stock_quantity: number;  // e.g., "1.2345"
  image: string;  // e.g., "CVD"
  sub_categories: boolean;
}


export function Products() {
  const [diamonds, setDiamonds] = useState<Diamonds[]>([]); // Use the User type for state
  const [products, setProducts] = useState<Product[]>([]); // Use the User type for state
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [plates, setPlates] = useState<Plates[]>([]); // Use the User type for state
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedPlate, setSelectedPlate] = useState<Plates | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(true);

  const [openAddDiamonds, setOpenAddDiamonds] = useState(false);
  const [newDiamond, setNewDiamond] = useState({
    diamond_id: '',
    shape: '',
    color: '',
    clarity: '',
    certificate: '',
    fluorescence: '',
    make: '',
    cut: '',
    symmetry: '',
    table_percentage: '',
    depth_percentage: '',
    polish: '',
    length_mm: '',
    width_mm: '',
    depth_mm: '',
    price: ''
  });
  const [selectedDiamond, setSelectedDiamond] = useState({
    diamond_id: '',
    shape: '',
    color: '',
    clarity: '',
    certificate: '',
    fluorescence: '',
    make: '',
    cut: '',
    symmetry: '',
    table_percentage: '',
    depth_percentage: '',
    polish: '',
    length_mm: 0.0,
    width_mm: 0.0,
    depth_mm: 0.0,
    price: 0
  });


  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    sub_categories: '',
    category_name: ''
  });
  const handleAddProduct = async () => {
    const formData = new FormData();

    // Append form fields to formData
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('price', newProduct.price);
    formData.append('stock_quantity', newProduct.stock_quantity);
    formData.append('sub_categories', newProduct.sub_categories);
    formData.append('category_name', newProduct.category_name);

    // Append selected images to formData with unique keys
    imageFiles.forEach((file, index) => {
        formData.append(`image`, file); // Notice the key is 'images[]'
    });

    try {
      const response = await axios.post('http://localhost:3000/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response);
      alert('Product added successfully!');
      setOpenAddProduct(false); // Close the dialog
    } catch (error) {
      console.error('Failed to add product:', error);
      alert('Failed to add product. Please try again.');
    }
};


  // Calculate the indices for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPlates = plates.slice(indexOfFirstItem, indexOfLastItem);
  const currentDiamonds = diamonds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const currentProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Calculate total pages
  const totalPages = Math.ceil(plates.length / itemsPerPage);
  const totalDiamonds = Math.ceil(diamonds.length / itemsPerPage);
  const totalProducts = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const [newPlate, setNewPlate] = useState({
    plate_id: '',
    size: '',
    diameter: '',
    thickness: '',
    carat_weight_ea: '',
    plate_type: '',
    material: '',
    price: '',
  });

  const [allProducts, setAllProducts] = useState(products);
  const deleteProduct = async (product_id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/products/${product_id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Immediately update the state to remove the deleted product
        setAllProducts((prevProducts) => prevProducts.filter((product) => product.product_id !== product_id));

        alert(`Product with ID ${product_id} was deleted.`);
      } else {
        alert('Failed to delete the product.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('An error occurred while deleting the product.');
    }
  };






  useEffect(() => {
    // Fetch diamonds from the API
    fetch('http://localhost:3000/api/diamonds')
      .then(response => response.json())
      .then(data => {
        setDiamonds(data);
        setLoading(false); // Set loading to false after data is loaded
      })
      .catch(error => {
        console.error('Error fetching diamonds:', error);
        setLoading(false); // Also set loading to false in case of error
      });
  }, []);

  useEffect(() => {
    // Fetch products from the API
    fetch('http://localhost:3000/api/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setLoading(false); // Set loading to false after data is loaded
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false); // Also set loading to false in case of error
      });

  }, []);


  useEffect(() => {
    // Fetch users from the API
    fetch('http://localhost:3000/api/plates')
      .then(response => response.json())
      .then(data => setPlates(data))
      .catch(error => console.error('Error fetching plates:', error));
  }, []);

  const handleAddPlate = () => {
    fetch('http://localhost:3000/api/plates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPlate),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add plate');
        }
        return response.json();
      })
      .then(data => {
        setPlates([...plates, data]);
        setOpenAddDialog(false);
        setNewPlate({
          plate_id: '',
          size: '',
          diameter: '',
          thickness: '',
          carat_weight_ea: '',
          plate_type: '',
          material: '',
          price: ''
        });
      })
      .catch(error => console.error('Error adding plate:', error));
  };

  const handleEditPlate = () => {
    if (!selectedPlate) return;

    fetch(`http://localhost:3000/api/plates/${selectedPlate.plate_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedPlate),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update plate');
        }
        return response.json();
      })
      .then((updatedPlate) => {
        setPlates(prevPlates =>
          prevPlates.map(plate =>
            plate.plate_id === updatedPlate.plate_id ? updatedPlate : plate
          )
        );
        setOpenEditDialog(false);
        setSelectedPlate(null);
      })
      .catch(error => console.error('Error updating plate:', error));
  };

  const handleDelete = (plate_id: string) => {
    if (window.confirm("Are you sure you want to delete this plate?")) {
      fetch(`http://localhost:3000/api/plates/${plate_id}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            setPlates(prevPlates => prevPlates.filter(plate => plate.plate_id !== plate_id));
          } else {
            console.error('Failed to delete the plate.');
          }
        })
        .catch(error => console.error('Error deleting plate:', error));
    }
  };

  // Function to handle deleting a diamond
  const handleDeleteDiamond = (diamond_id: string) => {
    if (window.confirm("Are you sure you want to delete this diamond?")) {
      fetch(`http://localhost:3000/api/diamonds/${diamond_id}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            setDiamonds(prevDiamonds => prevDiamonds.filter(diamond => diamond.diamond_id !== diamond_id));
          } else {
            console.error('Failed to delete the diamond.');
          }
        })
        .catch(error => console.error('Error deleting diamond:', error));
    }
  };
  // Function to handle opening the edit dialog with the selected diamond details

  const handleEditDiamond = () => {
    if (!selectedDiamond) return;

    fetch(`http://localhost:3000/api/diamonds/${selectedDiamond.diamond_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedDiamond),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update diamond');
        }
        return response.json();
      })
      .then((updatedDiamond) => {
        setDiamonds(prevDiamonds =>
          prevDiamonds.map(diamond =>
            diamond.diamond_id === updatedDiamond.diamond_id ? updatedDiamond : diamond
          )
        );
        setOpenEditDialog(false);
        setSelectedDiamond(null);
      })
      .catch(error => console.error('Error updating diamond:', error));
  };

  const openEditDialogWithDiamond = (diamond: SetStateAction<Diamonds | null>) => {
    setSelectedDiamond(diamond);
    setOpenEditDialog(true);
  };

  const openEditDialogWithPlate = (plate: Plates) => {
    setSelectedPlate(plate);
    setOpenEditDialog(true);
  };

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageSrcs, setImageSrcs] = useState<string[]>([]); // To store multiple image previews

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);

      setImageFiles(fileArray); // Store the selected files in imageFiles state

      const fileReaders = fileArray.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      Promise.all(fileReaders)
        .then((results) => setImageSrcs(results)) // Preview all images
        .catch((error) => console.error('Error reading files:', error));
    }
  };

  const handleAddDiamond = () => {
    const formData = new FormData();

    // Append diamond details to FormData
    Object.keys(newDiamond).forEach((key) => {
      formData.append(key, newDiamond[key as keyof Diamonds]);
    });

    // Append each image file to FormData
    imageFiles.forEach((file, index) => {
      formData.append(`image`, file); // Append the file to 'images[]' array
    });

    fetch('http://localhost:3000/api/diamonds', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(`Failed to add diamond: ${text}`);
          });
        }
        return response.json();
      })
      .then(data => {
        setDiamonds((prevDiamonds) => [...prevDiamonds, data]);
        setOpenAddDiamonds(false);
        setNewDiamond({
          diamond_id: '',
          shape: '',
          color: '',
          clarity: '',
          certificate: '',
          fluorescence: '',
          make: '',
          cut: '',
          polish: '',
          symmetry: '',
          table_percentage: '',
          depth_percentage: '',
          length_mm: '',
          width_mm: '',
          depth_mm: '',
          price: '',
        });
        setImageFiles([]); // Clear the image files after upload
        setImageSrcs([]);  // Clear the image previews
      })
      .catch(error => console.error('Error adding diamond:', error));
  };




  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve the role from local storage
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const navigate = useNavigate(); // Updated hook

  const handleLogout = () => {
    // Remove role and token from localStorage
    localStorage.removeItem('role');
    localStorage.removeItem('token');

    // Optionally, redirect to login page
    navigate('/login'); // Updated function

  };

  const [username, setUsername] = useState();

  useEffect(() => {
    const fetchUserData = async (user_id: string) => {
      // console.log(user_id)
      try {
        const response = await fetch(`http://localhost:3000/api/users/${user_id}`);
        if (response.ok) {
          const data = await response.json();
          setUsername(data.name);
        } else {
          console.error("Failed to fetch user data.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    // console.log(username)

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode<custompayload>(token);
      const user_id = decodedToken.user_id;
      fetchUserData(user_id);
    } else {
      console.log("No token found in local storage.");
    }
  }, []);
  const [categories, setCategories] = useState([]);

  const [subCategories, setSubCategories] = useState([]);

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Handle category change and update subcategories
  const handleCategoryChange = (e: { target: { value: any } }) => {
    const selectedCategory = e.target.value;
    setNewProduct({ ...newProduct, category_name: selectedCategory });

    // Find the selected category in the categories array
    const category = categories.find(cat => cat.name === selectedCategory);

    // If the category has subcategories, update the subCategories state
    if (category && category.sub_categories) {
      setSubCategories(category.sub_categories);
    } else {
      setSubCategories([]); // Clear subcategories if none are available
    }
  };
  // State to manage dialog visibility
  const [openAddProduct, setOpenAddProduct] = useState(false);

  // Handler to open dialog
  const handleOpenDialog = () => {
    setOpenAddProduct(true);
  };

  // Handler to close dialog (optional, if you want to control closing)
  const handleCloseDialog = () => {
    setOpenAddProduct(false);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Link
              href=""
              className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
              prefetch={false}
            >
              <Package2Icon className="h-4 w-4 transition-all group-hover:scale-110" />
              <span className="sr-only">Acme Inc</span>
            </Link>

            {role === "admin" && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/dashboard"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      prefetch={false}
                    >
                      <LayoutGridIcon className="h-5 w-5" />
                      <span className="sr-only">Overview</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Overview</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/orders"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      prefetch={false}
                    >
                      <ShoppingCartIcon className="h-5 w-5" />
                      <span className="sr-only">Orders</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Orders</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/users"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      prefetch={false}
                    >
                      <UsersIcon className="h-5 w-5" />
                      <span className="sr-only">Users</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Users</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/payments"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      prefetch={false}
                    >
                      <CreditCardIcon className="h-5 w-5" />
                      <span className="sr-only">Payments</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Payments</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/shipping"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      prefetch={false}
                    >
                      <TruckIcon className="h-5 w-5" />
                      <span className="sr-only">Shipping</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Shipping</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/discounts"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      prefetch={false}
                    >
                      <TagIcon className="mr-1.5 h-4 w-4" />
                      <span className="sr-only">Discounts</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Discounts</TooltipContent>
                </Tooltip>
              </>
            )}

            {(role === "admin" || role === "staff") && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/products"
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"

                      prefetch={false}
                    >
                      <PackageIcon className="h-5 w-5" />
                      <span className="sr-only">Products</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Products</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/categories"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      prefetch={false}
                    >
                      <ListIcon className="h-5 w-5" />
                      <span className="sr-only">Categories</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Categories</TooltipContent>
                </Tooltip>
              </>
            )}
          </TooltipProvider>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/settings"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  prefetch={false}
                >
                  <SettingsIcon className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href=""
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                  prefetch={false}
                >
                  <Package2Icon className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                <Link href="/dashboard" className="flex items-center gap-4 px-2.5 text-foreground" prefetch={false}>
                  <LayoutGridIcon className="h-5 w-5" />
                  Overview
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  Orders
                </Link>
                <Link
                  href="/users"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  <UsersIcon className="h-5 w-5" />
                  Users
                </Link>

                <Link
                  href="/products"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  <PackageIcon className="h-5 w-5" />
                  Products
                </Link>
                <Link
                  href="/categories"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  <ListIcon className="h-5 w-5" />
                  Categories
                </Link>
                <Link
                  href="/payments"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  <CreditCardIcon className="h-5 w-5" />
                  Payments
                </Link>

                <Link
                  href="/shipping"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  prefetch={false}
                >
                  <TruckIcon className="h-5 w-5" />
                  Shipping
                </Link>

              </nav>
            </SheetContent>
          </Sheet>
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard" prefetch={false}>
                    Dashboard
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Products</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="relative ml-auto flex-1 md:grow-0">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                <img
                  src="/placeholder.svg"
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                  style={{ aspectRatio: "36/36", objectFit: "cover" }}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{username ? username : "My Account"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="all">Products</TabsTrigger>
                <TabsTrigger value="diamonds">Diamonds</TabsTrigger>
                <TabsTrigger value="plates">Plates</TabsTrigger>

              </TabsList>

            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <div className="flex items-center">
                  <CardHeader>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>
                      Manage your products and view their sales performance.
                    </CardDescription>
                  </CardHeader>
                  <div className="ml-auto mr-10 flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 gap-1">
                          <ListFilter className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Filter
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem checked>
                          Active
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>
                          Archived
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button size="sm" variant="outline" className="h-8 gap-1">
                      <File className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Export
                      </span>
                    </Button>
                    <Button size="sm" className="h-8 gap-1" onClick={handleOpenDialog}>
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Product
                      </span>
                    </Button>
                  </div>
                </div>

                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Price
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Qty
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Sub categories
                        </TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentProducts.map((product) => (
                        <TableRow key={product.product_id}>
                          <TableCell className="hidden sm:table-cell">
                            <img
                              alt="Product image"
                              className="aspect-square rounded-md object-cover"
                              height="64"
                              src={product.image && product.image[0] ? `http://localhost:3000/uploads/${product.image[0]}` : '/placeholder.svg'}
                              width="64"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>
                            <Badge variant={product.category_name === 'Draft' ? 'outline' : 'secondary'}>
                              {product.category_name}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">₹{product.price}</TableCell>
                          <TableCell className="hidden md:table-cell">{product.stock_quantity}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {Array.isArray(product.sub_categories) && product.sub_categories.length > 0 ? (
                              product.sub_categories.map((subCategory: string, index: number) => (
                                <Badge key={index} className="mr-1 h-5">
                                  {subCategory}
                                </Badge>
                              ))
                            ) : (
                              <span> </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => deleteProduct(product.product_id)}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <Dialog open={openAddProduct} onOpenChange={setOpenAddProduct}>
                      <DialogContent style={{ maxWidth: '50%' }}>
                        <DialogHeader>
                          <DialogTitle>Add New Product</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-3">
                          {/* Column 0 - Image Upload */}
                          <div className="flex flex-col space-y-4">
                            <Image
                              alt="Product image"
                              className="aspect-square rounded-md object-cover"
                              height={250}
                              src={imageFiles[0] ? URL.createObjectURL(imageFiles[0]) : '/placeholder.svg'}
                              width={250}
                            />
                            <Input id="picture" type="file" multiple onChange={handleImageChange} />
                          </div>

                          {/* Other columns with input fields */}
                          <div className="flex flex-col space-y-4">
                            <Input
                              placeholder="Product Name"
                              value={newProduct.name}
                              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            />
                            <Input
                              placeholder="Description"
                              value={newProduct.description}
                              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            />
                            <Input
                              placeholder="Price"
                              value={newProduct.price}
                              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            />
                            <Input
                              placeholder="Stock Quantity"
                              value={newProduct.stock_quantity}
                              onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })}
                            />

                            {/* Category Dropdown */}
                            <select
                              className="border border-gray-300 rounded-md p-2 w-full"
                              value={newProduct.category_name}
                              onChange={handleCategoryChange} // Changed to handleCategoryChange
                            >
                              <option value="">Select Category</option>
                              {categories.map((category) => (
                                <option key={category.category_id} value={category.name}>
                                  {category.name}
                                </option>
                              ))}
                            </select>

                            {/* Subcategory Dropdown */}
                            <select
                              className="border border-gray-300 rounded-md p-2 w-full"
                              value={newProduct.sub_categories}
                              multiple
                              onChange={(e) => {
                                const selectedSubCategories = Array.from(e.target.selectedOptions, option => option.value);
                                setNewProduct({ ...newProduct, sub_categories: selectedSubCategories });
                              }}
                            >
                              <option value="">Select Subcategories</option>
                              {subCategories.map((subCategory, index) => (
                                <option key={index} value={subCategory}>
                                  {subCategory}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddProduct}>Add Product</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </Table>
                </CardContent>
                <CardFooter>
                  <Pagination>
                    <PaginationContent>
                      {/* Handle Previous Button */}
                      <li className={currentPage === 1 ? 'disabled' : ''}>
                        <PaginationPrevious
                          href="#"
                          onClick={() => handlePageChange(currentPage - 1)}
                        />
                      </li>

                      {/* Page Numbers */}
                      {[...Array(totalProducts)].map((_, i) => (
                        <li key={i + 1}>
                          <PaginationLink
                            href="#"
                            onClick={() => handlePageChange(i + 1)}
                            className={currentPage === i + 1 ? 'active' : ''}
                          >
                            {i + 1}
                          </PaginationLink>
                        </li>
                      ))}

                      {/* Handle Next Button */}
                      <li className={currentPage === totalProducts ? 'disabled' : ''}>
                        <PaginationNext
                          href="#"
                          onClick={() => handlePageChange(currentPage + 1)}
                        />
                      </li>
                    </PaginationContent>
                  </Pagination>

                </CardFooter>
              </Card>


            </TabsContent>
            <TabsContent value="diamonds">
              <Card x-chunk="dashboard-06-chunk-0">
                <div className="flex items-center">
                  <CardHeader>
                    <CardTitle>Diamonds</CardTitle>
                    <CardDescription>
                      Manage your products and view their sales performance.
                    </CardDescription>
                  </CardHeader>
                  <div className="ml-auto mr-10 flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 gap-1">
                          <ListFilter className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Filter
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem checked>
                          Active
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>
                          Archived
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button size="sm" variant="outline" className="h-8 gap-1">
                      <File className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Export
                      </span>
                    </Button>
                    <Button size="sm" className="h-8 gap-1"
                      onClick={() => setOpenAddDiamonds(true)}>
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Diamonds
                      </span>
                    </Button>
                  </div>
                </div>
                <CardContent>
                  <div className="overflow-x-auto">
                    {loading ? (
                      <Skeleton className="min-w-[1200px] h-[400px] rounded-lg" /> // Skeleton while data is loading
                    ) : (
                      <Table className="min-w-[1200px]">
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Shape</TableHead>
                            <TableHead>Color</TableHead>
                            <TableHead>Clarity</TableHead>
                            <TableHead>Certificate</TableHead>
                            <TableHead>Fluorescence</TableHead>
                            <TableHead>Make</TableHead>
                            <TableHead>Cut</TableHead>
                            <TableHead>Polish</TableHead>
                            <TableHead>Length (mm)</TableHead>
                            <TableHead>Width (mm)</TableHead>
                            <TableHead>Depth (mm)</TableHead>
                            <TableHead>
                              <span className="sr-only">Actions</span>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentDiamonds.map((diamond) => (
                            <TableRow key={diamond.diamond_id}>
                              <TableCell>{diamond.diamond_id}</TableCell>
                              <TableCell className="font-medium">{diamond.shape}</TableCell>
                              <TableCell>{diamond.color}</TableCell>
                              <TableCell>{diamond.clarity}</TableCell>
                              <TableCell>{diamond.certificate}</TableCell>
                              <TableCell>{diamond.fluorescence || 'N/A'}</TableCell>
                              <TableCell>{diamond.make || 'N/A'}</TableCell>
                              <TableCell>{diamond.cut || 'N/A'}</TableCell>
                              <TableCell>{diamond.polish || 'N/A'}</TableCell>
                              <TableCell>{diamond.length_mm}</TableCell>
                              <TableCell>{diamond.width_mm}</TableCell>
                              <TableCell>{diamond.depth_mm}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => openEditDialogWithDiamond(diamond)}
                                  >
                                    <FilePenIcon className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleDeleteDiamond(diamond.diamond_id)}
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </CardContent>

                <CardFooter>
                  <Pagination>
                    <PaginationContent>
                      {/* Handle Previous Button */}
                      <li className={currentPage === 1 ? 'disabled' : ''}>
                        <PaginationPrevious
                          href="#"
                          onClick={() => handlePageChange(currentPage - 1)}
                        />
                      </li>

                      {/* Page Numbers */}
                      {[...Array(totalDiamonds)].map((_, i) => (
                        <li key={i + 1}>
                          <PaginationLink
                            href="#"
                            onClick={() => handlePageChange(i + 1)}
                            className={currentPage === i + 1 ? 'active' : ''}
                          >
                            {i + 1}
                          </PaginationLink>
                        </li>
                      ))}

                      {/* Handle Next Button */}
                      <li className={currentPage === totalDiamonds ? 'disabled' : ''}>
                        <PaginationNext
                          href="#"
                          onClick={() => handlePageChange(currentPage + 1)}
                        />
                      </li>
                    </PaginationContent>
                  </Pagination>

                </CardFooter>
              </Card>
              <Dialog open={openAddDiamonds} onOpenChange={setOpenAddDiamonds}>
                <DialogContent style={{ maxWidth: '90%' }}> {/* Set a custom width */}
                  <DialogHeader>
                    <DialogTitle>Add New Diamond</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-6 gap-3"> {/* Adjust grid columns to 4 */}
                    {/* Column 0 */}
                    <div className="flex flex-col space-y-4">
                      <Image
                        alt="Product image"
                        className="aspect-square rounded-md object-cover"
                        height={250}
                        src={imageSrcs[0] || '/placeholder.svg'} // Display the first image or a placeholder
                        width={250}
                      />
                      <Input id="picture" type="file" multiple onChange={handleImageChange} />

                      <button onClick={handleAddDiamond} className="btn btn-primary">
                        Upload Image
                      </button>

                    </div>
                    {/* Column 1 */}
                    <div className="flex flex-col space-y-4">
                      <Input
                        placeholder="Diamond ID"
                        value={newDiamond.diamond_id}
                        onChange={(e) => setNewDiamond({ ...newDiamond, diamond_id: e.target.value })}
                      />
                      <select

                        className="border  border-gray-300 rounded-md p-2 w-full"
                        value={newDiamond.shape}
                        onChange={(e) => setNewDiamond({ ...newDiamond, shape: e.target.value })} // Correctly passing the event handler
                      >
                        <option >Shape</option> {/* Default empty option */}
                        <option value="Round">Round</option>
                        <option value="Princess">Princess</option>
                        <option value="Pear">Pear</option>
                        <option value="Heart">Heart</option>
                        <option value="Oval">Oval</option>
                        <option value="Raadiant">Radiant</option>
                        <option value="Marquise">Marquise</option>
                        <option value="Asscher">Asscher</option>
                        <option value="Cushion">Cushion</option>
                        <option value="Other">Other</option>
                        {/* Add more options as needed */}
                      </select>


                      <select

                        className="border  border-gray-300 rounded-md p-2 w-full"
                        value={newDiamond.color}
                        onChange={(e) => setNewDiamond({ ...newDiamond, color: e.target.value })} // Correctly passing the event handler
                      >
                        <option>Color</option> {/* Default empty option */}
                        <option value="D">D</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
                        <option value="H">H</option>
                        <option value="I">I</option>
                        <option value="J">J</option>
                        <option value="K">K</option>
                        <option value="L">L</option>
                        <option value="M">M</option>
                        <option value="N">N</option>
                        <option value="O-P">O-P</option>
                        <option value="Q-R">Q-R</option>
                        <option value="S-T">S-T</option>
                        <option value="U-V">U-V</option>
                        <option value="W-X">W-X</option>
                        <option value="Y-Z">Y-Z</option>
                        {/* Add more options as needed */}
                      </select>

                    </div>
                    {/* Column 2 */}
                    <div className="flex flex-col space-y-4">
                      <Input
                        placeholder="Clarity"
                        value={newDiamond.clarity}
                        onChange={(e) => setNewDiamond({ ...newDiamond, clarity: e.target.value })}
                      />

                      <select

                        className="border  border-gray-300 rounded-md p-2 w-full"
                        // value={newDiamond.shape}
                        value={newDiamond.certificate}
                        onChange={(e) => setNewDiamond({ ...newDiamond, certificate: e.target.value })} // Correctly passing the event handler
                      >
                        <option value="">Certificate</option> {/* Default empty option */}
                        {/* 'GIA', 'IGI', 'HRD', 'SGL', 'FM', 'GCAL', 'GSI', 'Other' */}

                        <option value="GIA">GIA</option>
                        <option value="IGI">IGI</option>
                        <option value="HRD">HRD</option>
                        <option value="SGL">SGL</option>
                        <option value="FM">FM</option>
                        <option value="GCAL">GCAL</option>
                        <option value="GSI">GSI</option>
                        <option value="Other">Other</option>
                        {/* Add more options as needed */}
                      </select>
                      <Input
                        placeholder="Fluorescence"
                        value={newDiamond.fluorescence}
                        onChange={(e) => setNewDiamond({ ...newDiamond, fluorescence: e.target.value })}
                      />
                    </div>
                    {/* Column 3 */}
                    <div className="flex flex-col space-y-4">
                      <Input
                        placeholder="Make"
                        value={newDiamond.make}
                        onChange={(e) => setNewDiamond({ ...newDiamond, make: e.target.value })}
                      />
                      <Input
                        placeholder="Cut"
                        value={newDiamond.cut}
                        onChange={(e) => setNewDiamond({ ...newDiamond, cut: e.target.value })}
                      />
                      <Input
                        placeholder="symmetry"
                        value={newDiamond.symmetry}
                        onChange={(e) => setNewDiamond({ ...newDiamond, symmetry: e.target.value })}
                      />

                    </div>
                    {/* Column 4 */}
                    <div className="flex flex-col space-y-4">
                      <Input
                        placeholder="Length (mm)"
                        value={newDiamond.length_mm}
                        onChange={(e) => setNewDiamond({ ...newDiamond, length_mm: e.target.value })}
                      />
                      <Input
                        placeholder="Width (mm)"
                        value={newDiamond.width_mm}
                        onChange={(e) => setNewDiamond({ ...newDiamond, width_mm: e.target.value })}
                      />
                      <Input
                        placeholder="Depth (mm)"
                        value={newDiamond.depth_mm}
                        onChange={(e) => setNewDiamond({ ...newDiamond, depth_mm: e.target.value })}
                      />
                    </div>
                    {/* Column 5 */}
                    <div className="flex flex-col space-y-4">
                      <Input
                        placeholder="Table %"
                        value={newDiamond.table_percentage}
                        onChange={(e) => setNewDiamond({ ...newDiamond, table_percentage: e.target.value })}
                      />
                      <Input
                        placeholder="Depth %"
                        value={newDiamond.depth_percentage}
                        onChange={(e) => setNewDiamond({ ...newDiamond, depth_percentage: e.target.value })}
                      />
                      <Input
                        placeholder="Price"
                        value={newDiamond.price}
                        onChange={(e) => setNewDiamond({ ...newDiamond, price: e.target.value })}
                      />


                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddDiamond}>Add Diamond</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                <DialogContent style={{ maxWidth: '90%' }}>
                  <DialogHeader>
                    <DialogTitle>Edit Diamond</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-6 gap-3">
                    {/* Column 0 */}
                    <div className="flex flex-col space-y-4">
                      <Input
                        placeholder="Diamond ID"
                        value={selectedDiamond?.diamond_id || ''}
                        onChange={(e) => setSelectedDiamond({ ...selectedDiamond, diamond_id: e.target.value })}
                        disabled
                      />
                      <select
                        className="border border-gray-300 rounded-md p-2 w-full"
                        value={selectedDiamond?.shape || ''}
                        onChange={(e) => setSelectedDiamond({ ...selectedDiamond, shape: e.target.value })}
                      >
                        <option >Shape</option> {/* Default empty option */}
                        <option value="Round">Round</option>
                        <option value="Princess">Princess</option>
                        <option value="Pear">Pear</option>
                        <option value="Heart">Heart</option>
                        <option value="Oval">Oval</option>
                        <option value="Raadiant">Radiant</option>
                        <option value="Marquise">Marquise</option>
                        <option value="Asscher">Asscher</option>
                        <option value="Cushion">Cushion</option>
                        <option value="Other">Other</option>
                      </select>

                      <select
                        className="border border-gray-300 rounded-md p-2 w-full"
                        value={selectedDiamond?.color || ''}
                        onChange={(e) => setSelectedDiamond({ ...selectedDiamond, color: e.target.value })}
                      >
                        <option value="">Color</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
                        <option value="H">H</option>
                        <option value="I">I</option>
                        <option value="J">J</option>
                        <option value="K">K</option>
                        <option value="L">L</option>
                        <option value="M">M</option>
                        <option value="N">N</option>
                        <option value="O-P">O-P</option>
                        <option value="Q-R">Q-R</option>
                        <option value="S-T">S-T</option>
                        <option value="U-V">U-V</option>
                        <option value="W-X">W-X</option>
                        <option value="Y-Z">Y-Z</option>
                      </select>
                    </div>
                    {/* Column 1 */}
                    <div className="flex flex-col space-y-4">
                      <Input
                        placeholder="Clarity"
                        value={selectedDiamond?.clarity || ''}
                        onChange={(e) => setSelectedDiamond({ ...selectedDiamond, clarity: e.target.value })}
                      />
                      <select
                        className="border border-gray-300 rounded-md p-2 w-full"
                        value={selectedDiamond?.certificate || ''}
                        onChange={(e) => setSelectedDiamond({ ...selectedDiamond, certificate: e.target.value })}
                      >
                        <option value="">Certificate</option>
                        <option value="GIA">GIA</option>
                        <option value="IGI">IGI</option>
                        <option value="HRD">HRD</option>
                        <option value="SGL">SGL</option>
                        <option value="FM">FM</option>
                        <option value="GCAL">GCAL</option>
                        <option value="GSI">GSI</option>
                        <option value="Other">Other</option>
                      </select>
                      <Input
                        placeholder="Fluorescence"
                        value={selectedDiamond?.fluorescence || ''}
                        onChange={(e) => setSelectedDiamond({ ...selectedDiamond, fluorescence: e.target.value })}
                      />
                    </div>
                    {/* Column 2 */}
                    <div className="flex flex-col space-y-4">
                      <Input
                        placeholder="Make"
                        value={selectedDiamond?.make || ''}
                        onChange={(e) => setSelectedDiamond({ ...selectedDiamond, make: e.target.value })}
                      />
                      <Input
                        placeholder="Cut"
                        value={selectedDiamond?.cut || ''}
                        onChange={(e) => setSelectedDiamond({ ...selectedDiamond, cut: e.target.value })}
                      />
                      <Input
                        placeholder="Symmetry"
                        value={selectedDiamond?.symmetry || ''}
                        onChange={(e) => setSelectedDiamond({ ...selectedDiamond, symmetry: e.target.value })}
                      />
                    </div>
                    {/* Column 3 */}
                    <div className="flex flex-col space-y-4">
                      <Input
                        placeholder="Length (mm)"
                        value={selectedDiamond?.length_mm || ''}
                        onChange={(e) => setSelectedDiamond({ ...selectedDiamond, length_mm: parseFloat(e.target.value) })}
                      />
                      <Input
                        placeholder="Width (mm)"
                        value={selectedDiamond?.width_mm || ''}
                        onChange={(e) => setSelectedDiamond({ ...selectedDiamond, width_mm: parseFloat(e.target.value) })}
                      />
                      <Input
                        placeholder="Depth (mm)"
                        value={selectedDiamond?.depth_mm || ''}
                        onChange={(e) => setSelectedDiamond({ ...selectedDiamond, depth_mm: parseFloat(e.target.value) })}
                      />
                      <Input
                        placeholder="Depth (mm)"
                        value={selectedDiamond?.price || ''}
                        onChange={(e) => setSelectedDiamond({ ...selectedDiamond, price: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
                    <Button onClick={handleEditDiamond}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>




            </TabsContent>
            <TabsContent value="plates">
              <Card x-chunk="dashboard-06-chunk-0">
                <div className="flex items-center">
                  <CardHeader>
                    <CardTitle>Plates</CardTitle>
                    <CardDescription>
                      Manage your products and view their sales performance.
                    </CardDescription>
                  </CardHeader>
                  <div className="ml-auto mr-10 flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 gap-1">
                          <ListFilter className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Filter
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem checked>
                          Active
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>
                          Archived
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button size="sm" variant="outline" className="h-8 gap-1">
                      <File className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Export
                      </span>
                    </Button>
                    <Button size="sm" className="h-8 gap-1" onClick={() => setOpenAddDialog(true)}>
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add CVD
                      </span>
                    </Button>
                  </div>
                </div>

                <CardContent>
                  <Table>

                    <TableHeader>
                      <TableRow>
                        <TableHead>Plate ID</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Diameter</TableHead>
                        <TableHead>Thickness</TableHead>
                        <TableHead>Carat Weight (ea)</TableHead>
                        <TableHead>Plate Type</TableHead>
                        <TableHead>Material</TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentPlates.map((plate) => (
                        <TableRow key={plate.plate_id}>
                          <TableCell>{plate.plate_id}</TableCell>
                          <TableCell className="font-medium">{plate.size} x {plate.size} mm</TableCell>
                          <TableCell>{plate.diameter}</TableCell>
                          <TableCell>{plate.thickness}</TableCell>
                          <TableCell>{plate.carat_weight_ea}</TableCell>
                          <TableCell>{plate.plate_type}</TableCell>
                          <TableCell>{plate.material}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => openEditDialogWithPlate(plate)}
                              >
                                <FilePenIcon className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(plate.plate_id)}
                              >
                                <TrashIcon className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <Pagination>
                    <PaginationContent>
                      {/* Handle Previous Button */}
                      <li className={currentPage === 1 ? 'disabled' : ''}>
                        <PaginationPrevious
                          href="#"
                          onClick={() => handlePageChange(currentPage - 1)}
                        />
                      </li>

                      {/* Page Numbers */}
                      {[...Array(totalPages)].map((_, i) => (
                        <li key={i + 1}>
                          <PaginationLink
                            href="#"
                            onClick={() => handlePageChange(i + 1)}
                            className={currentPage === i + 1 ? 'active' : ''}
                          >
                            {i + 1}
                          </PaginationLink>
                        </li>
                      ))}

                      {/* Handle Next Button */}
                      <li className={currentPage === totalPages ? 'disabled' : ''}>
                        <PaginationNext
                          href="#"
                          onClick={() => handlePageChange(currentPage + 1)}
                        />
                      </li>
                    </PaginationContent>
                  </Pagination>

                </CardFooter>
              </Card>



              {/* Add Plate Dialog */}
              <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New CVD</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Plate ID"
                      value={newPlate.plate_id}
                      onChange={(e) => setNewPlate({ ...newPlate, plate_id: e.target.value })}
                    />
                    <Input
                      placeholder="Size (mm)"
                      value={newPlate.size}
                      onChange={(e) => setNewPlate({ ...newPlate, size: e.target.value })}
                    />
                    <Input
                      placeholder="Diameter"
                      value={newPlate.diameter}
                      onChange={(e) => setNewPlate({ ...newPlate, diameter: e.target.value })}
                    />
                    <Input
                      placeholder="Thickness (mm)"
                      value={newPlate.thickness}
                      onChange={(e) => setNewPlate({ ...newPlate, thickness: e.target.value })}
                    />
                    <Input
                      placeholder="Carat Weight (ct)"
                      value={newPlate.carat_weight_ea}
                      onChange={(e) => setNewPlate({ ...newPlate, carat_weight_ea: e.target.value })}
                    />

                    <select

                      className="border  border-gray-300 rounded-md p-2 w-full"
                      value={newPlate.plate_type}
                      onChange={(e) => setNewPlate({ ...newPlate, plate_type: e.target.value })} // Correctly passing the event handler
                    >
                      <option >Select CVD</option>
                      <option value="CVD Plate">CVD Plate</option>
                      <option value="Electronic Grade CVD">Electronic Grade CVD</option>
                      <option value="Mechanical Grade CVD">Mechanical Grade CVD</option>
                      <option value="Thermal Grade CVD">Thermal Grade CVD</option>
                      <option value="Optical Grade CVD">Optical Grade CVD</option>
                      {/* Add more options as needed */}
                    </select>
                    <Input
                      placeholder="Material"
                      value={newPlate.material}
                      onChange={(e) => setNewPlate({ ...newPlate, material: e.target.value })}
                    />
                    <Input
                      placeholder="Price"
                      value={newPlate.price}
                      onChange={(e) => setNewPlate({ ...newPlate, price: e.target.value })}
                    />
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddPlate}>Add CVD</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {/* Edit Plate Dialog */}
              <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Plate</DialogTitle>
                  </DialogHeader>
                  {selectedPlate && (
                    <div className="space-y-4">
                      <Input
                        placeholder="Plate ID"
                        value={selectedPlate.plate_id}
                        onChange={(e) => setSelectedPlate({ ...selectedPlate, plate_id: e.target.value })}
                      />
                      <Input
                        placeholder="Size"
                        value={selectedPlate.size}
                        onChange={(e) => setSelectedPlate({ ...selectedPlate, size: e.target.value })}
                      />
                      <Input
                        placeholder="Diameter"
                        value={selectedPlate.diameter}
                        onChange={(e) => setSelectedPlate({ ...selectedPlate, diameter: e.target.value })}
                      />
                      <Input
                        placeholder="Thickness"
                        value={selectedPlate.thickness}
                        onChange={(e) => setSelectedPlate({ ...selectedPlate, thickness: e.target.value })}
                      />
                      <Input
                        placeholder="Carat Weight (ea)"
                        value={selectedPlate.carat_weight_ea}
                        onChange={(e) => setSelectedPlate({ ...selectedPlate, carat_weight_ea: e.target.value })}
                      />

                      <select

                        className="border  border-gray-300 rounded-md p-2 w-full"
                        value={selectedPlate.plate_type}
                        onChange={(e) => setSelectedPlate({ ...selectedPlate, plate_type: e.target.value })} // Correctly passing the event handler
                      >
                        {/* Default empty option */}
                        <option value="CVD Plate">CVD Plate</option>
                        <option value="Electronic Grade CVD">Electronic Grade CVD</option>
                        <option value="Mechanical Grade CVD">Mechanical Grade CVD</option>
                        <option value="Thermal Grade CVD">Thermal Grade CVD</option>
                        <option value="Optical Grade CVD">Optical Grade CVD</option>
                        {/* Add more options as needed */}
                      </select>
                      <Input
                        placeholder="Material"
                        value={selectedPlate.material}
                        onChange={(e) => setSelectedPlate({ ...selectedPlate, material: e.target.value })}
                      />
                    </div>
                  )}
                  <DialogFooter>
                    <Button onClick={handleEditPlate}>Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

            </TabsContent>

          </Tabs>
        </main>
      </div>
    </div>

  )
}




function CreditCardIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  )
}


function LayoutGridIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  )
}


function ListIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  )
}


function MenuIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}


function Package2Icon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  )
}


function PackageIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}


function SearchIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}


function SettingsIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}


function ShoppingCartIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}





function TruckIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  )
}


function UsersIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

