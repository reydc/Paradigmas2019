module Interp where

import Graphics.Gloss
import Graphics.Gloss.Data.Vector
import Graphics.Gloss.Geometry.Angle
import qualified Graphics.Gloss.Data.Point.Arithmetic as V

import Dibujo
type FloatingPic = Vector -> Vector -> Vector -> Picture
type Output a = a -> FloatingPic

-- el vector nulo
zero :: Vector
zero = (0,0)

half :: Vector -> Vector
half = (0.5 V.*)

-- comprender esta función es un buen ejericio.
hlines :: Vector -> Float -> Float -> [Picture]
hlines v@(x,y) mag sep = map (hline . (*sep)) [0..]
  where hline h = line [(x,y+h),(x+mag,y+h)] 

-- Una grilla de n líneas, comenzando en v con una separación de sep y
-- una longitud de l (usamos composición para no aplicar este argumento).
grid :: Int -> Vector -> Float -> Float -> Picture
grid n v sep l = pictures [ls,translate 0 (l*toEnum n) (rotate 90 ls)]
  where ls = pictures $ take (n+1) $ hlines v sep l

-- figuras adaptables comunes
trian1 :: FloatingPic
trian1 a b c = line $ map (a V.+) [zero, half b V.+ c , b , zero]

trian2 :: FloatingPic
trian2 a b c = line $ map (a V.+) [zero, c, b,zero]

trianD :: FloatingPic
trianD a b c = line $ map (a V.+) [c, half b , b V.+ c , c]

rectan :: FloatingPic
rectan a b c = line [a, a V.+ b, a V.+ b V.+ c, a V.+ c,a]

simple :: Picture -> FloatingPic
simple p _ _ _ = p

fShape :: FloatingPic
fShape a b c = line . map (a V.+) $ [ zero,uX, p13, p33, p33 V.+ uY , p13 V.+ uY 
                 , uX V.+ 4 V.* uY ,uX V.+ 5 V.* uY, x4 V.+ y5
                 , x4 V.+ 6 V.* uY, 6 V.* uY, zero]    
  where p33 = 3 V.* (uX V.+ uY)
        p13 = uX V.+ 3 V.* uY
        x4 = 4 V.* uX
        y5 = 5 V.* uY
        uX = (1/6) V.* b
        uY = (1/6) V.* c

-- Dado por Miguel Pagano para testear (13/04/2019)
(x,y) .+ (x',y') = (x+x',y+y')
s .* (x,y) = (s*x,s*y)
(x,y) .- (x',y') = (x-x',y-y')
negar (x,y) = (-x,-y)

bezier :: Vector -> Vector -> Vector -> Int -> [Vector]
bezier p0 p1 p2 n = [ p1 .+ (((1-t)^2) .* (p0 .+ (negar p1))) .+ ((t^2) .* (p2 .+ (negar p1))) | t <- ts]
 where ts = 0:map (divF n) [1..n]
       divF :: Int -> Int -> Float
       divF j i = toEnum i / toEnum j

curva :: FloatingPic
curva a b c = line $ bezier a (a .+ b .+((1/3) .* c)) (a .+ b .+ c) 10
-- Fin de la curva dada por Miguel Pagano.

-- Dada una función que produce una figura a partir de un a y un vector
-- producimos una figura flotante aplicando las transformaciones
-- necesarias. Útil si queremos usar figuras que vienen de archivos bmp.
transf :: (a -> Vector -> Picture) -> a -> Vector -> FloatingPic
transf f d (xs,ys) a b c  = translate (fst a') (snd a') .
                             scale (magV b/xs) (magV c/ys) .
                             rotate ang $ f d (xs,ys)
  where ang = radToDeg $ argV b
        a' = a V.+ half (b V.+ c)

-- Output a = a -> FloatingPic
-- FloatingPic = Vector -> Vector -> Vector -> Picture
interp :: Output a -> Output (Dibujo a)
interp f = sem f rotar espejar rot45 apilar juntar encimar 

rotar :: FloatingPic -> FloatingPic
rotar p a b c = p (a V.+ b) c ((-1) V.* b)

espejar :: FloatingPic -> FloatingPic
espejar p a b c = p (a V.+ b) ((-1) V.* b) c 

rot45 :: FloatingPic -> FloatingPic
rot45 p a b c = p (a V.+ (half (b V.+ c))) (half (b V.+ c)) (half (c V.+ ((-1) V.* b))) 

apilar :: Int -> Int -> FloatingPic -> FloatingPic -> FloatingPic
apilar n m p q a b c = pictures [p (a V.+ (rr V.* c)) b (r V.* c), q a b (rr V.* c)]
                     where r = (fromIntegral n) / (fromIntegral (m + n))
                           rr = (fromIntegral m) / (fromIntegral (m + n))

juntar :: Int -> Int -> FloatingPic -> FloatingPic -> FloatingPic
juntar n m p q a b c = pictures [p a bb c, q (a V.+ bb) (rr V.* b) c ]
                     where r = (fromIntegral n) / (fromIntegral (m + n))
                           rr = (fromIntegral m) / (fromIntegral (m + n)) 
                           bb = r V.* b

encimar :: FloatingPic -> FloatingPic -> FloatingPic
encimar p r a b c = pictures [p a b c , r a b c]

