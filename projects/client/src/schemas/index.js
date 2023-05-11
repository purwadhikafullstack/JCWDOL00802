import * as yup from "yup";

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;

export const basicSchema = yup.object().shape({
  // USER
  email: yup
    .string()
    .email("Email tidak valid")
    .required("Tolong masukan E-mail anda"),
  password: yup
    .string()
    .min(8)
    .max(16)
    .matches(passwordRules, { message: "Kata sandi kurang kuat" })
    .required("Masukan Kata Sandi"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Kata sandi tidak sama")
    .required("Masukan ulang kata sandi"),

  // PRODUCT
  productName: yup.string().max(100).required("Masukan nama produk"),
  productDescription: yup.string().max(500),
  price: yup.number().positive().integer().required("Input harga"),
  weight: yup.number().positive().integer().required("Input berat"),

  // CATEGORY
  categoryName: yup.string().max(100).required("Masukan nama kategori"),

  // WAREHOUSE
  warehouseName: yup.string().max(100).required("Masukan nama gudang"),
  warehouseAddress: yup.string().max(150),
  phone: yup.number().positive().integer().required("Input Nomor Telepon"),

  //PROMO
  promoCode: yup.string().min(6).max(30).required("Masukan promo code"),
  promoDescription: yup.string().max(300),
  promoMax: yup.number().positive().required("Masukan jumlah max promo"),
  promoLimit: yup.number().positive().required("Masukan minimal pembelanjaan"),
  count: yup.number().positive().required("Masukan jumlah max promo per user"),
});
