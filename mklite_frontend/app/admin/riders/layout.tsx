import RiderSidebar from "@/app/components/RiderSidebar";
import styles from "./AdminLayout.module.css"; // usa el mismo layout del admin si quieres

export default function RiderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.adminLayout}>
      <RiderSidebar />

      <main className={styles.pageContent}>
        {children}
      </main>
    </div>
  );
}
