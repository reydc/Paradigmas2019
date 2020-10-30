module Basico.Escher where

import Graphics.Gloss
import Graphics.Gloss.Data.Picture
import Dibujo
import Interp

data Escher = Vacio | Trian1 | Trian2 | TrianD | Rectan | FShape | Curva
            deriving (Eq,Show)

-- Aprovechamos simple de Interp para envolver blank (un Picture).
vacio :: FloatingPic
vacio = simple blank

outEscher :: Output Escher
outEscher Vacio  = vacio
outEscher Trian1 = trian1
outEscher Trian2 = trian2
outEscher TrianD = trianD
outEscher Rectan = rectan
outEscher FShape = fShape
outEscher Curva  = curva

-- El dibujo u.
dibujo_u :: Dibujo Escher -> Dibujo Escher
dibujo_u bp = encimar4 bp2
            where bp1 = bp
                  bp2 = Espejar $ Rot45 bp1

-- El dibujo t.
dibujo_t :: Dibujo Escher -> Dibujo Escher
dibujo_t bp = Encimar bp (Encimar bp2 bp3)
            where bp1 = bp
                  bp2 = Espejar $ Rot45 bp1
                  bp3 = r270 bp2

-- Esquina con nivel de detalle en base a la figura p.
esquina :: Int -> Dibujo Escher -> Dibujo Escher
esquina 1 p = cuarteto noDib noDib noDib (dibujo_u p)
            where noDib = pureDib Vacio
esquina n p = cuarteto (esquina (n-1) p) (lado (n-1) p) (Rotar $ lado (n-1) p) (dibujo_u p) 

-- Lado con nivel de detalle.
lado :: Int -> Dibujo Escher -> Dibujo Escher
lado 1 p = cuarteto noDib noDib (Rotar $ dibujo_t p) (dibujo_t p)
         where noDib = pureDib Vacio
lado n p = cuarteto (lado (n-1) p) (lado (n-1) p) (Rotar $ dibujo_t p) (dibujo_t p)

-- Función noneto

noneto p q r s t u v w x = Apilar 1 2 (Juntar 1 2 p (Juntar 1 1 q r)) 
                                      (Apilar 1 1 (Juntar 1 2 s (Juntar 1 1 t u)) (Juntar 1 2 v (Juntar 1 1 w x)))

-- El dibujo de Escher.
escher :: Int -> Escher -> Dibujo Escher
escher i e = noneto (esquina i p) 
					(lado i p)
					(r270 $ esquina i p) 
					(Rotar $ lado i p) 
					(dibujo_u p)
					(r270 $ lado i p) 
					(Rotar $ esquina i p) 
					(r180 $ lado i p) 
					(r180 $ esquina i p)
           where p = pureDib e

{- Ejemplos -}

-- Basicos de Escher
ej_bt1 = pureDib Trian1
ej_bt2 = pureDib Trian2
ej_btD = pureDib TrianD

-- Ejemplos para dibujo_u y dibujo_t
ej_u1 = dibujo_u $ pureDib Trian1
ej_u2 = dibujo_u $ pureDib Trian2
ej_uD = dibujo_u $ pureDib TrianD

ej_t1 = dibujo_t $ pureDib Trian1
ej_t2 = dibujo_t $ pureDib Trian2
ej_tD = dibujo_t $ pureDib TrianD

-- Límite cuadrado
sqrlim2_1 = escher 2 Trian1
sqrlim2_2 = escher 2 Trian2
sqrlim2_D = escher 2 TrianD
sqrlim4_C = escher 4 Curva

{- Fin de Ejemplos -}
