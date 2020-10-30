module Main where
import Graphics.Gloss
import Graphics.Gloss.Interface.IO.Display
import Graphics.UI.GLUT.Begin
import Dibujo
import Interp
import qualified Basico.Escher  as Es

data Conf a = Conf {
    basic :: Output a
  , fig  :: Dibujo a
  , width :: Float
  , height :: Float
  }

-- Función auxiliar para construir una configuración y dejar listo para mostrar figuras.
newCfg :: Output a -> Dibujo a -> Float -> Float -> Conf a
newCfg = \interpret figure x y -> (Conf { basic = interpret, fig = figure, width = x, height = y })

-- Nueva configuración para el tipo Escher.
newEscherFig :: Dibujo Es.Escher -> Float -> Float -> Conf Es.Escher
newEscherFig = \figure x y -> newCfg Es.outEscher figure x y

-- Acción de mostrar algún dibujo de tipo Escher.
showEscherFigs :: Dibujo Es.Escher -> Float -> Float -> IO ()
showEscherFigs = \figure x y -> (initial . return) (newEscherFig figure x y)

{- Sección de Escher.hs -}

-- Los límites cuadrados para los tres triángulos.
sq2con1 = showEscherFigs Es.sqrlim2_1 1000 1000
sq2con2 = showEscherFigs Es.sqrlim2_2 1000 1000
sq2conD = showEscherFigs Es.sqrlim2_D 1000 1000
sq2conCurva = showEscherFigs Es.sqrlim4_C 1000 1000

-- Testeo de los argumentos de noneto.
testp = showEscherFigs (Es.esquina 2 (Basica Es.Trian2)) 500 500
testq = showEscherFigs (Es.lado 2 (Basica Es.Trian2)) 500 500
testr = showEscherFigs (r270 $ Es.esquina 2 (Basica Es.Trian2)) 500 500
tests = showEscherFigs (Rotar $ Es.lado 2 (Basica Es.Trian2)) 500 500
testt = showEscherFigs (Es.dibujo_u (Basica Es.Trian2)) 500 500
testu = showEscherFigs (r270 $ Es.lado 2 (Basica Es.Trian2)) 500 500
testv = showEscherFigs (Rotar $ Es.esquina 2 (Basica Es.Trian2)) 500 500
testw = showEscherFigs (r180 $ Es.lado 2 (Basica Es.Trian2)) 500 500
testx = showEscherFigs (r180 $ Es.lado 2 (Basica Es.Trian2)) 500 500

{- Fin de la sección de Escher.hs -}

-- Dada una computación que construye una configuración, mostramos por
-- pantalla la figura de la misma de acuerdo a la interpretación para
-- las figuras básicas. Permitimos una computación para poder leer
-- archivos, tomar argumentos, etc.
initial :: IO (Conf a) -> IO ()
initial cf = cf >>= \cfg ->
                  let x  = width cfg
                      y  = height cfg
                  in display win white $ interp (basic cfg) (fig cfg) (0,0) (x,0) (0,y)

win = InWindow "Nice Window" (500, 500) (0, 0)

main = sq2con2
