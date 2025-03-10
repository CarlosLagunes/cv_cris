// @ts-nocheck
"use client";

import { useEffect, useRef } from "react";

export default function Home() {
  const magazineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadScripts = async () => {
      if (!(window as any).jQuery) {
        // ✅ Cargar jQuery 1.7.1
        const scriptJQuery = document.createElement("script");
        scriptJQuery.src = "http://code.jquery.com/jquery-1.7.1.min.js"; // ✅ Versión exacta
        scriptJQuery.async = true;
        scriptJQuery.onload = () => {
          console.log("✅ jQuery 1.7.1 cargado");
          loadTurnJS();
        };
        document.body.appendChild(scriptJQuery);
      } else {
        loadTurnJS();
      }
    };

    const loadTurnJS = () => {
      if (!(window as any).$.fn.turn) {
        // ✅ Cargar turn.min.js desde public/
        const scriptTurn = document.createElement("script");
        scriptTurn.src = "/turn.js";
        scriptTurn.async = true;
        scriptTurn.onload = () => {
          console.log("✅ turn.js cargado correctamente");
          initializeTurnJS();
        };
        document.body.appendChild(scriptTurn);
      } else {
        initializeTurnJS();
      }
    };

    const initializeTurnJS = () => {
      if (magazineRef.current && (window as any).$ && (window as any).$.fn.turn) {
        const $magazine = (window as any).$(magazineRef.current);

        $magazine.turn({
          display: "double",
          acceleration: true,
          gradients: !(window as any).$.isTouch,
          elevation: 50,
          when: {
            turned: function (e: Event, page: number) {
              console.log("📖 Página actual:", page);
            },
          },
        });

        // ✅ Agregar eventos de teclado
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === "ArrowLeft") $magazine.turn("previous"); // Flecha izquierda
          else if (e.key === "ArrowRight") $magazine.turn("next"); // Flecha derecha
        };

        // ✅ Agregar evento de clic en la página
        const handleClick = (e: MouseEvent) => {
          const rect = magazineRef.current!.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const middleX = rect.width / 2;

          if (clickX < middleX) {
            $magazine.turn("previous"); // Si hace clic en la izquierda, va atrás
          } else {
            $magazine.turn("next"); // Si hace clic en la derecha, avanza
          }
        };

        window.addEventListener("keydown", handleKeyDown);
        magazineRef.current!.addEventListener("click", handleClick);

        return () => {
          $magazine.turn("destroy"); // ✅ Destruir la instancia cuando el componente se desmonta
          window.removeEventListener("keydown", handleKeyDown);
          magazineRef.current!.removeEventListener("click", handleClick);
        };
      } else {
        console.error("❌ Error: $.fn.turn no está definido.");
      }
    };

    loadScripts();
  }, []);

  return (
    <div>
      <div
        id="magazine"
        ref={magazineRef}
        style={{
          width: "1152px",
          height: "752px",
          background: "#ccc",
        }}
      >
      {[...Array(49)].map((_, index) => (
  <div
    key={index}
    style={{
      backgroundImage: `url('/pages/${(index + 1).toString().padStart(2, '0')}.png')`,
      backgroundSize: "100% 100%",
      width: "576px",
      height: "752px",
    }}
  />
))}
      </div>
    </div>
  );
}
