"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useState } from "react";
function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  return <div>REGISTER PAGE BITCH</div>;
}
export default RegisterPage;
