import { Calculator } from "@/components/Calculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Calculadora Científica
          </h1>
          <p className="text-muted-foreground text-lg">
            Calculadora web con validación de operaciones en el backend
          </p>
        </div>
        <Calculator />
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p className="mb-2">Operaciones disponibles:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 rounded-full bg-secondary">Suma (+)</span>
            <span className="px-3 py-1 rounded-full bg-secondary">Resta (−)</span>
            <span className="px-3 py-1 rounded-full bg-secondary">Multiplicación (×)</span>
            <span className="px-3 py-1 rounded-full bg-secondary">División (÷)</span>
            <span className="px-3 py-1 rounded-full bg-secondary">Módulo (%)</span>
            <span className="px-3 py-1 rounded-full bg-secondary">Potencia (x^y)</span>
            <span className="px-3 py-1 rounded-full bg-secondary">Raíz (√)</span>
            <span className="px-3 py-1 rounded-full bg-secondary">División Entera (div)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
