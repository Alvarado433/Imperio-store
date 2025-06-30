"use client";

import React from "react";
import { FaChevronDown } from "react-icons/fa";

interface SidebarLinkProps {
  onClick: () => void;
  icon: React.ReactNode;
  text: string;
  open: boolean;
  ativo: boolean;
  isDropdown?: boolean;
  isOpen?: boolean;
}

export default function SidebarLink({
  onClick,
  icon,
  text,
  open,
  ativo,
  isDropdown = false,
  isOpen = false,
}: SidebarLinkProps) {
  return (
    <button
      onClick={onClick}
      className={`sidebar-link ${ativo ? "active" : ""}`}
      style={{
        background: ativo ? "#ffc107" : "transparent",
        border: "none",
        width: "100%",
        textAlign: "left",
        padding: "10px 16px",
        cursor: "pointer",
        color: ativo ? "#212529" : "#ced4da",
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontWeight: ativo ? "bold" : "normal",
      }}
      title={!open ? text : undefined}
    >
      {icon}
      {open && <span>{text}</span>}
      {isDropdown && open && (
        <FaChevronDown
          style={{
            marginLeft: "auto",
            transform: isOpen ? "rotate(180deg)" : "none",
            transition: "0.3s",
          }}
        />
      )}
    </button>
  );
}
