module Basico.Ejemplo where

import Dibujo
import Interp

-------------------------------------
{-
-- Tipo Configuración:

data Conf a = Conf {
    basic :: Output a
  , fig  :: Dibujo a
  , width :: Float
  , height :: Float
  }

-}
-------------------------------------

data Comunes = Trian1
             | Trian2
             | TrianD
             | Rectan
             -- | Simple
             | FShape
             deriving (Eq,Show)
-- Output a = a -> FloatingPic

-- Da una interpretación básica de los comunes.
-- interpCom :: Comunes -> FLoatingPic
out :: Output Comunes
out Trian1 = trian1
out Trian2 = trian2
out TrianD = trianD
out Rectan = rectan
--out Simple = simple 
out FShape = fShape

-- Todos tipo (Comunes)
ej1 = Trian1
ej2 = Trian2
ej3 = TrianD
ej4 = Rectan
-- ej5 = Simple
ej6 = FShape

-- Todos tipo (Dibujo Comunes), con la misma figura común.
ej_const1 = Basica Trian1
ej_const2 = Basica Trian2
ej_const3 = Basica TrianD
ej_const4 = Basica Rectan
--ej_const5 = Basica Simple
ej_const6 = Basica FShape

ej_comp1_1 = Rotar $ Basica Trian1
ej_comp1_2 = Espejar $ Basica Trian1
ej_comp1_3 = Rot45 $ Basica Trian1
ej_comp1_5 i1 i2 = Apilar i1 i2 (Basica Trian1) (Basica Trian1) 
ej_comp1_6 i1 i2 = Juntar i1 i2 (Basica Trian1) (Basica Trian1)
ej_comp1_7 = Encimar (Basica Trian1) (Basica Trian1)

ej_comp2_1 = Rotar $ Basica Trian2
ej_comp2_2 = Espejar $ Basica Trian2
ej_comp2_3 = Rot45 $ Basica Trian2
ej_comp2_5 i1 i2 = Apilar i1 i2 (Basica Trian2) (Basica Trian2) 
ej_comp2_6 i1 i2 = Juntar i1 i2 (Basica Trian2) (Basica Trian2)
ej_comp2_7 = Encimar (Basica Trian2) (Basica Trian2)

ej_comp3_1 = Rotar $ Basica TrianD
ej_comp3_2 = Espejar $ Basica TrianD
ej_comp3_3 = Rot45 $ Basica TrianD
ej_comp3_5 i1 i2 = Apilar i1 i2 (Basica TrianD) (Basica TrianD) 
ej_comp3_6 i1 i2 = Juntar i1 i2 (Basica TrianD) (Basica TrianD)
ej_comp3_7 = Encimar (Basica TrianD) (Basica TrianD)

-- Todos tipo (Dibujo Comunes), donde varia figura común.
ej_comp1 = Espejar $ Basica Trian1
ej_comp2 = Espejar $ Espejar $ Basica Trian1
ej_comp3 = Espejar $ Rotar $ Basica Trian1
ej_comp4 = Espejar $ Basica Trian2
ej_comp5 = Espejar $ Espejar $ Basica Trian2
ej_comp6 = Espejar $ Rotar $ Basica Trian2
ej_comp7 = Espejar $ Basica TrianD
ej_comp8 = Espejar $ Espejar $ Basica TrianD
ej_comp9 = Encimar (Espejar $ Rotar $ Basica TrianD) (Espejar $ Espejar $ Basica Trian2)
