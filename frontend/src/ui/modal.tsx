export default function Modal({ children }: { children: React.ReactNode }) {
  return (
    <div className="z-50 w-full h-full bg-[#000000aa] absolute inset-0 flex items-center justify-center">
      {children}
    </div>
  );
}
