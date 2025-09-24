import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  console.log("\n====================");
  console.log("📧 SIMULASI PENGIRIMAN EMAIL 📧");
  console.log("Tujuan:", to);
  console.log("Subjek:", subject);
  console.log("Isi Pesan:", text); 
  console.log("====================\n");
  
  return Promise.resolve();
};
