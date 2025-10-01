import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CalculationRequest {
  operation: string;
  a: number;
  b: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { operation, a, b }: CalculationRequest = await req.json();
    
    console.log(`Calculando: ${operation}, a=${a}, b=${b}`);

    // Validación de entrada
    if (typeof a !== 'number' || isNaN(a)) {
      console.error('Primer operando inválido:', a);
      return new Response(
        JSON.stringify({ error: 'El primer operando debe ser un número válido' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (typeof b !== 'number' || isNaN(b)) {
      console.error('Segundo operando inválido:', b);
      return new Response(
        JSON.stringify({ error: 'El segundo operando debe ser un número válido' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    let result: number;

    switch (operation) {
      case 'suma':
        result = a + b;
        console.log(`Suma: ${a} + ${b} = ${result}`);
        break;
      
      case 'resta':
        result = a - b;
        console.log(`Resta: ${a} - ${b} = ${result}`);
        break;
      
      case 'multiplicacion':
        result = a * b;
        console.log(`Multiplicación: ${a} * ${b} = ${result}`);
        break;
      
      case 'division':
        if (b === 0) {
          console.error('División por cero');
          return new Response(
            JSON.stringify({ error: 'No se puede dividir por cero' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }
        result = a / b;
        console.log(`División: ${a} / ${b} = ${result}`);
        break;
      
      case 'modulo':
        if (b === 0) {
          console.error('Módulo por cero');
          return new Response(
            JSON.stringify({ error: 'No se puede calcular el módulo con divisor cero' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }
        result = a % b;
        console.log(`Módulo: ${a} % ${b} = ${result}`);
        break;
      
      case 'potencia':
        if (a === 0 && b < 0) {
          console.error('Potencia: 0 elevado a un exponente negativo');
          return new Response(
            JSON.stringify({ error: 'No se puede elevar 0 a un exponente negativo' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }
        result = Math.pow(a, b);
        console.log(`Potencia: ${a} ^ ${b} = ${result}`);
        
        if (!isFinite(result)) {
          console.error('Resultado infinito en potencia');
          return new Response(
            JSON.stringify({ error: 'El resultado es demasiado grande' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }
        break;
      
      case 'raiz':
        if (a < 0) {
          console.error('Raíz cuadrada de número negativo');
          return new Response(
            JSON.stringify({ error: 'No se puede calcular la raíz cuadrada de un número negativo' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }
        result = Math.sqrt(a);
        console.log(`Raíz cuadrada: √${a} = ${result}`);
        break;
      
      case 'division_entera':
        if (b === 0) {
          console.error('División entera por cero');
          return new Response(
            JSON.stringify({ error: 'No se puede dividir por cero' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }
        result = Math.floor(a / b);
        console.log(`División entera: ${a} // ${b} = ${result}`);
        break;
      
      default:
        console.error('Operación no reconocida:', operation);
        return new Response(
          JSON.stringify({ error: 'Operación no válida' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }

    // Validar que el resultado es un número válido
    if (!isFinite(result)) {
      console.error('Resultado no finito:', result);
      return new Response(
        JSON.stringify({ error: 'El resultado no es un número válido' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Operación exitosa. Resultado: ${result}`);

    return new Response(
      JSON.stringify({ result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error en el servidor:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
