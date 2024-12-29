import Action_Figures from "../../assets/Home/ActionFigure.jpeg";

import Activewear from "../../assets/Home/Activewear.jpeg";
import Accessories from "../../assets/Home/Accessories.jpeg";
// import Bike_Accessories from "../../assets/Home/Bike_Accessories.jpeg";
import Bedding from "../../assets/Home/Bedding.jpeg";
import Beauty_Tools from "../../assets/Home/BeautyTools.jpeg";
import Biographies from "../../assets/Home/Biographies.jpeg";
import Cameras from "../../assets/Home/Camera.jpeg";
import Car_Accessories from "../../assets/Home/CarAccessories.jpeg";
import Car_Care from "../../assets/Home/CarCare.jpeg";
import Childrens_Books from "../../assets/Home/ChildrensBook.jpeg";
import Clothing_Accessories from "../../assets/Home/ClothingAccessories.jpeg";
import Comics from "../../assets/Home/Comics.jpeg";
import Cookware from "../../assets/Home/Cookware.jpeg";
import Cricket_Gear from "../../assets/Home/CricketGear.jpeg";
import Cycling from "../../assets/Home/Cycling.jpeg";
import Dolls from "../../assets/Home/Dolls.jpeg";
import Educational from "../../assets/Home/Education.jpeg";
import Educational_Toys from "../../assets/Home/EducationalToys.jpeg";
import Footwear from "../../assets/Home/Footwear.jpeg";
import First_Aid from "../../assets/Home/FirstAid.jpeg";
import Fitness_Equipment from "../../assets/Home/FitnessEquipment.jpeg";
import Football_Equipment from "../../assets/Home/FootballEquipment.jpeg";
import Furniture from "../../assets/Home/Furniture.jpeg";
import Gamining_Consoles from "../../assets/Home/GamingConsole.jpeg";
import Gym_Essentials from "../../assets/Home/GymEssential.jpeg";
import Hair_Care from "../../assets/Home/HairCare.jpeg";
import Headphones from "../../assets/Home/Headphones.jpeg";
import Home_Decor from "../../assets/Home/HomeDecor.jpeg";
import Hygiene_Products from "../../assets/Home/HygieneProducts.jpeg";
// import Kitchen_Appliances from "../../assets/Home/KitchenAppliance.jpeg";
import Kids_Clothing from "../../assets/Home/KidsCloths.jpeg";
import Laptops from "../../assets/Home/Laptop.jpeg";
import Makeup from "../../assets/Home/Makeup.jpeg";
import Mobile_phone from "../../assets/Home/Mobile.jpeg";
import Mens_Clothing from "../../assets/Home/MenCloths.jpeg";
import Navigation_Systems from "../../assets/Home/NavigationSystems.jpeg";
import Nail_Care from "../../assets/Home/NailCare.jpeg";
import Non_Fiction from "../../assets/Home/NonFiction.jpeg";
import Outdoor_Sports from "../../assets/Home/OutdoorSports.jpeg";
import Outdoor_Toys from "../../assets/Home/OutdoorToys.jpeg";
import Perfumes from "../../assets/Home/Perfumes.jpeg";
import Puzzles from "../../assets/Home/Puzzles.jpeg";
import Personal_Care from "../../assets/Home/PersonalCare.jpeg";
import RC_Toys from "../../assets/Home/RCToys.jpeg";
import Self_Help from "../../assets/Home/SelfHelp.jpeg";
import Smartwatches from "../../assets/Home/Smartwatches.jpeg";
import Skincare from "../../assets/Home/Skincare.jpeg";
import Storage_Solutions from "../../assets/Home/StorageSolutions.jpeg";
// import Supplements from "../../assets/Home/Supplements.jpeg";
import Swimming_Gear from "../../assets/Home/SwimmingGear.jpeg";
import Tennis_Accessories from "../../assets/Home/TennisAccessories.jpeg";
import Tires from "../../assets/Home/Tires.jpeg";
import Tools from "../../assets/Home/Tools.jpeg";
// import Winter_Wear from "../../assets/Home/WinterWear.jpeg";
import Womens_Clothing from "../../assets/Home/womenCloths.jpeg";
import Vitamins from "../../assets/Home/Vitamins.jpeg";

export const categories = [
  {
    title: "Electronics",
    items: [
      { name: "Mobile Phones", photo: Mobile_phone },
      { name: "Laptops", photo: Laptops },
      { name: "Cameras", photo: Cameras },
      { name: "Headphones", photo: Headphones },
      { name: "Smartwatches", photo: Smartwatches },
      // { name: "Gaming Consoles", photo: Gaming_Consoles },
      { name: "Accessories", photo: Accessories },
    ],
  },
  {
    title: "Clothing",
    items: [
      { name: "Men's Clothing", photo: Mens_Clothing },
      { name: "Women's Clothing", photo: Womens_Clothing },
      { name: "Kids' Clothing", photo: Kids_Clothing },
      { name: "Footwear", photo: Footwear },
      // { name: "Winter Wear", photo: Winter_Wear },
      { name: "Activewear", photo: Activewear },
      { name: "Accessories", photo: Clothing_Accessories },
    ],
  },
  {
    title: "Home & Kitchen",
    items: [
      { name: "Furniture", photo: Furniture },
      // { name: "Kitchen Appliances", photo: Kitchen_Appliances },
      { name: "Cookware", photo: Cookware },
      { name: "Home Decor", photo: Home_Decor },
      { name: "Bedding", photo: Bedding },
      { name: "Storage Solutions", photo: Storage_Solutions },
      // { name: "Cleaning Supplies", photo: Cleaning_Supplies },
    ],
  },
  {
    title: "Beauty",
    items: [
      { name: "Makeup", photo: Makeup },
      { name: "Skincare", photo: Skincare },
      { name: "Hair Care", photo: Hair_Care },
      { name: "Perfumes", photo: Perfumes },
      // { name: "Bath & Body", photo: Bath_and_Body },
      { name: "Nail Care", photo: Nail_Care },
      { name: "Tools & Accessories", photo: Beauty_Tools },
    ],
  },
  {
    title: "Health",
    items: [
      // { name: "Supplements", photo: Supplements },
      { name: "Fitness Equipment", photo: Fitness_Equipment },
      // { name: "Healthcare Devices", photo: Healthcare_Devices },
      { name: "Vitamins", photo: Vitamins },
      { name: "Personal Care", photo: Personal_Care },
      { name: "First Aid", photo: First_Aid },
      { name: "Hygiene Products", photo: Hygiene_Products },
    ],
  },
  {
    title: "Books",
    items: [
      // { name: "Fiction", photo: Fiction },
      { name: "Non-Fiction", photo: Non_Fiction },
      { name: "Children's Books", photo: Childrens_Books },
      { name: "Educational", photo: Educational },
      { name: "Comics", photo: Comics },
      { name: "Biographies", photo: Biographies },
      { name: "Self-Help", photo: Self_Help },
    ],
  },
  {
    title: "Toys",
    items: [
      { name: "Action Figures", photo: Action_Figures },
      { name: "Puzzles", photo: Puzzles },
      { name: "Educational Toys", photo: Educational_Toys },
      { name: "Dolls", photo: Dolls },
      { name: "Outdoor Toys", photo: Outdoor_Toys },
      // { name: "Board Games", photo: Board_Games },
      { name: "RC Toys", photo: RC_Toys },
    ],
  },
  {
    title: "Sports",
    items: [
      { name: "Cricket Gear", photo: Cricket_Gear },
      { name: "Football Equipment", photo: Football_Equipment },
      { name: "Cycling", photo: Cycling },
      { name: "Gym Essentials", photo: Gym_Essentials },
      { name: "Outdoor Sports", photo: Outdoor_Sports },
      { name: "Swimming Gear", photo: Swimming_Gear },
      { name: "Tennis Accessories", photo: Tennis_Accessories },
    ],
  },
  {
    title: "Automotive",
    items: [
      { name: "Car Accessories", photo: Car_Accessories },
      // { name: "Bike Accessories", photo: Bike_Accessories },
      // { name: "Oils & Lubricants", photo: Oils_and_Lubricants },
      { name: "Car Care", photo: Car_Care },
      { name: "Tools", photo: Tools },
      { name: "Tires", photo: Tires },
      { name: "Navigation Systems", photo: Navigation_Systems },
    ],
  },
];
