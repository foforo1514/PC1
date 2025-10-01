import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type Operation = "suma" | "resta" | "multiplicacion" | "division" | "modulo" | "potencia" | "raiz" | "division_entera";

export const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<Operation | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const handleOperation = (nextOperation: Operation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      performCalculation(operation, previousValue, inputValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const performCalculation = async (op: Operation, a: number, b: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("calculate", {
        body: { operation: op, a, b },
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
        setDisplay("Error");
        setPreviousValue(null);
        setOperation(null);
      } else {
        const result = data.result.toString();
        setDisplay(result);
        setPreviousValue(parseFloat(result));
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      });
      setDisplay("Error");
      setPreviousValue(null);
      setOperation(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const inputValue = parseFloat(display);
      performCalculation(operation, previousValue, inputValue);
      setOperation(null);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const handleSquareRoot = () => {
    const inputValue = parseFloat(display);
    performCalculation("raiz", inputValue, 0);
    setWaitingForOperand(true);
  };

  const buttonClass = "h-16 text-lg font-semibold calculator-button";

  return (
    <Card className="w-full max-w-md mx-auto p-6 bg-card shadow-2xl">
      <div className="mb-6 p-6 bg-calculator-display rounded-lg shadow-inner">
        <div className="calculator-display text-right text-foreground break-all min-h-[3rem] flex items-center justify-end">
          {loading ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            display
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <Button
          onClick={handleClear}
          className={`${buttonClass} bg-destructive hover:bg-destructive/90 text-destructive-foreground col-span-2`}
        >
          C
        </Button>
        <Button
          onClick={handleSquareRoot}
          className={`${buttonClass} bg-calculator-special hover:bg-calculator-special-hover text-primary-foreground`}
          disabled={loading}
        >
          √
        </Button>
        <Button
          onClick={() => handleOperation("division")}
          className={`${buttonClass} bg-calculator-operator hover:bg-calculator-operator-hover text-primary-foreground`}
          disabled={loading}
        >
          ÷
        </Button>

        {[7, 8, 9].map((num) => (
          <Button
            key={num}
            onClick={() => handleNumber(num.toString())}
            className={`${buttonClass} bg-calculator-button hover:bg-calculator-button-hover text-foreground`}
            disabled={loading}
          >
            {num}
          </Button>
        ))}
        <Button
          onClick={() => handleOperation("multiplicacion")}
          className={`${buttonClass} bg-calculator-operator hover:bg-calculator-operator-hover text-primary-foreground`}
          disabled={loading}
        >
          ×
        </Button>

        {[4, 5, 6].map((num) => (
          <Button
            key={num}
            onClick={() => handleNumber(num.toString())}
            className={`${buttonClass} bg-calculator-button hover:bg-calculator-button-hover text-foreground`}
            disabled={loading}
          >
            {num}
          </Button>
        ))}
        <Button
          onClick={() => handleOperation("resta")}
          className={`${buttonClass} bg-calculator-operator hover:bg-calculator-operator-hover text-primary-foreground`}
          disabled={loading}
        >
          −
        </Button>

        {[1, 2, 3].map((num) => (
          <Button
            key={num}
            onClick={() => handleNumber(num.toString())}
            className={`${buttonClass} bg-calculator-button hover:bg-calculator-button-hover text-foreground`}
            disabled={loading}
          >
            {num}
          </Button>
        ))}
        <Button
          onClick={() => handleOperation("suma")}
          className={`${buttonClass} bg-calculator-operator hover:bg-calculator-operator-hover text-primary-foreground`}
          disabled={loading}
        >
          +
        </Button>

        <Button
          onClick={() => handleNumber("0")}
          className={`${buttonClass} bg-calculator-button hover:bg-calculator-button-hover text-foreground col-span-2`}
          disabled={loading}
        >
          0
        </Button>
        <Button
          onClick={handleDecimal}
          className={`${buttonClass} bg-calculator-button hover:bg-calculator-button-hover text-foreground`}
          disabled={loading}
        >
          .
        </Button>
        <Button
          onClick={handleEquals}
          className={`${buttonClass} bg-primary hover:bg-primary/90 text-primary-foreground`}
          disabled={loading}
        >
          =
        </Button>

        <Button
          onClick={() => handleOperation("modulo")}
          className={`${buttonClass} bg-calculator-special hover:bg-calculator-special-hover text-primary-foreground`}
          disabled={loading}
        >
          %
        </Button>
        <Button
          onClick={() => handleOperation("potencia")}
          className={`${buttonClass} bg-calculator-special hover:bg-calculator-special-hover text-primary-foreground`}
          disabled={loading}
        >
          x^y
        </Button>
        <Button
          onClick={() => handleOperation("division_entera")}
          className={`${buttonClass} bg-calculator-special hover:bg-calculator-special-hover text-primary-foreground col-span-2`}
          disabled={loading}
        >
          div
        </Button>
      </div>
    </Card>
  );
};
