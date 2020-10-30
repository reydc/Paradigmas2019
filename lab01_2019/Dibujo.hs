module Dibujo where

import Data.Either
import Data.Monoid

-- Lenguaje
data Dibujo a = Basica a
              | Rotar (Dibujo a)
              | Espejar (Dibujo a)
              | Rot45 (Dibujo a)
              | Apilar Int Int (Dibujo a) (Dibujo a)
              | Juntar Int Int (Dibujo a) (Dibujo a)
              | Encimar (Dibujo a) (Dibujo a)
              deriving (Eq,Show)

-- COMBINADORES

-- Componer n veces la función.
comp :: (a -> a) -> Int -> a -> a
comp f 0 = id
comp f n = comp f (n - 1) . f

-- Rotaciones de múltiplos de 90.
r180, r270 :: Dibujo a -> Dibujo a
r180 = comp Rotar 2
r270 = comp Rotar 3

(.-.), (///), (^^^) :: Dibujo a -> Dibujo a -> Dibujo a
-- Pone una figura sobre otra. Como se define en el mismo espacio.
(.-.) d1 d2 = Apilar 1 1 d1 d2

-- Pone una figura al lado de otra.
(///) d1 d2 = Juntar 1 1 d1 d2

-- Superposicion de figuras.
(^^^) d1 d2 = Encimar d1 d2 

cuarteto :: Dibujo a -> Dibujo a -> Dibujo a -> Dibujo a -> Dibujo a
cuarteto d1 d2 d3 d4 = (d1 /// d2) .-. (d3 /// d4)

encimar4, ciclar :: Dibujo a -> Dibujo a
encimar4 d1 = d1 ^^^ ((Rotar d1) ^^^ ((comp Rotar 2 d1) ^^^ (comp Rotar 3 d1)))
ciclar d1  = cuarteto d1 (Rotar d1) (comp Rotar 2 d1) (comp Rotar 3 d1)

{- Definiciones de instancias -}

instance Functor Dibujo where
    -- Mapeo para la instancia.
    -- fmap :: (a -> b) -> Dibujo a -> Dibujo b
    fmap f (Basica k)  = Basica $ f k
    fmap f (Rotar k)   = Rotar $ fmap f k
    fmap f (Espejar k) = Espejar $ fmap f k
    fmap f (Rot45 k)   = Rot45 $ fmap f k
    fmap f (Apilar i1 i2 k1 k2) = Apilar i1 i2 (fmap f k1) (fmap f k2)
    fmap f (Juntar i1 i2 k1 k2) = Juntar i1 i2 (fmap f k1) (fmap f k2)
    fmap f (Encimar k1 k2)      = Encimar (fmap f k1) (fmap f k2)

-- Fin: Instancia de Functor

-- Información sobre Foldable:
-- https://en.wikibooks.org/wiki/Haskell/Foldable
-- https://hackage.haskell.org/package/base-4.12.0.0/docs/Data-Foldable.html
-- Más información sobre ciertas leyes en:
-- https://stackoverflow.com/questions/43645939/how-can-i-understand-the-laws-for-foldable-instances
instance Foldable Dibujo where
    -- Mapea cada elemento de la estructura a un monoide, y combina los resultados.
    -- foldMap :: (a -> m) -> Dibujo a -> m
    foldMap f (Basica x)  = f x
    foldMap f (Rotar x)   = foldMap f x
    foldMap f (Espejar x) = foldMap f x
    foldMap f (Rot45 x)   = foldMap f x
    foldMap f (Apilar i1 i2 x1 x2) = foldMap f x1 `mappend` foldMap f x2
    foldMap f (Juntar i1 i2 x1 x2) = foldMap f x1 `mappend` foldMap f x2
    foldMap f (Encimar x1 x2)      = foldMap f x1 `mappend` foldMap f x2

    -- Fold por derecha(en asociación) de la estructura, reduce valores de un tipo a otro.
    -- foldr :: (a -> b -> b) -> b -> t a -> b
    -- foldr :: (a -> b -> b) -> b -> Dibujo a -> b
    foldr f e (Basica x)  = f x e
    foldr f e (Rotar x)   = foldr f e x
    foldr f e (Espejar x) = foldr f e x
    foldr f e (Rot45 x)   = foldr f e x
    foldr f e (Apilar i1 i2 x1 x2) = foldr f (foldr f e x1) x2
    foldr f e (Juntar i1 i2 x1 x2) = foldr f (foldr f e x1) x2
    foldr f e (Encimar x1 x2)      = foldr f (foldr f e x1) x2

-- Fin: Instancia de Foldable.

{- Fin de las definiciones de instancia -}
{- Testeando en ghci con:
test_a = Apilar 1 1 (Rotar (Basica 4)) (Rot45 (Basica 7))
test_b = Apilar 1 1 (Rotar (Basica 'b')) (Rot45 (Basica 'a'))
test_c = Basica "sdaakfkakfmkmkf"
test_d = Basica ()
test_e = Encimar (Apilar 1 1 (Rot45 (Basica "sd")) (Rotar (Espejar (Basica "asdsad")))) (Apilar 1 1 (Rotar (Basica "ds")) (Rot45 (Basica "sd")))
test_f = Encimar (Apilar 1 1 (Rot45 (Basica 13)) (Rotar (Espejar (Basica 31)))) (Apilar 1 1 (Rotar (Basica 132)) (Rot45 (Basica 12)))

-- True
test_Rot360_1 = Rotar $ Rotar $ Rotar $ Rotar $ Basica 21

--True
test_Rot360_2 = Apilar 2 4  (Encimar (Rot45 $ test_Rot360_1) (Espejar $ Espejar $ Basica 1)) test_f

-- False
test_Rot360_3 =  Juntar 4 5 test_a (Juntar 1 3 (Rotar $ Rotar $ Basica 21) (Rotar $ Rotar $ Rotar $ Basica 21))

-- True
test_Flip2_1 = test_Rot360_2

-- False
test_Flip2_2 = Encimar test_e test_e

-- False
test_Flip2_3 = Apilar 4 7 (test_Flip2_2) (Juntar 3 4 (Rotar $ Rotar $ Rotar $ Rot45 $ Basica "asdaasassa") (Rot45 $ Rot45 $ Espejar $ Basica ""))
-}

-- ESQUEMAS DE MANIPULACIÓN

-- Sumerge un valor puro en el contexto de Dibujo.
pureDib :: a -> Dibujo a
pureDib = Basica

-- Mapeo para Dibujo, definido como instancia de Funtor.
mapDib :: (a -> b) -> Dibujo a -> Dibujo b
mapDib = fmap

-- Cambia las figuras básicas.
cambiar :: (a -> Dibujo b) -> Dibujo a -> Dibujo b
cambiar g (Basica k)  = g k
cambiar g (Rotar k)   = Rotar $ cambiar g k
cambiar g (Espejar k) = Espejar $ cambiar g k
cambiar g (Rot45 k)   = Rot45 $ cambiar g k
cambiar g (Apilar i1 i2 k1 k2) = Apilar i1 i2 (cambiar g k1) (cambiar g k2)
cambiar g (Juntar i1 i2 k1 k2) = Juntar i1 i2 (cambiar g k1) (cambiar g k2)
cambiar g (Encimar k1 k2) = Encimar (cambiar g k1) (cambiar g k2)

-- Función para la semántica.
sem :: (a -> b) -> 
       (b -> b) -> 
       (b -> b) -> 
       (b -> b) ->
       (Int -> Int -> b -> b -> b) -> 
       (Int -> Int -> b -> b -> b) -> 
       (b -> b -> b) ->
       Dibujo a -> b
sem f g h t k r b (Basica x)  = f x
sem f g h t k r b (Rotar x)   = g $ sem f g h t k r b x
sem f g h t k r b (Espejar x) = h $ sem f g h t k r b x
sem f g h t k r b (Rot45 x)   = t $ sem f g h t k r b x
sem f g h t k r b (Apilar i1 i2 x1 x2) = k i1 i2 (sem f g h t k r b x1) (sem f g h t k r b x2)
sem f g h t k r b (Juntar i1 i2 x1 x2) = r i1 i2 (sem f g h t k r b x1) (sem f g h t k r b x2)
sem f g h t k r b (Encimar x1 x2)      = b (sem f g h t k r b x1) (sem f g h t k r b x2)

-- Usando los esquemas anteriores, es decir no se puede hacer patter-matching, definir estas funciones:
type Pred a = a -> Bool

-- Dado un predicado sobre básicas, cambiar todas las que satisfacen.
-- El predicado por una figura basica indicada por el segundo argumento.
-- Hay por lo menos dos formas de definir esta función. Utilizando cambiar o fmap.
-- Utilizando fmap: limpia p y = fmap (\x -> if p y then y else x)
limpia :: Pred a -> a -> Dibujo a -> Dibujo a
limpia p y = cambiar (pureDib . (\x -> if p y then y else x))

anyDib, allDib :: Pred a -> Dibujo a -> Bool

-- Alguna básica satisface el predicado.
anyDib p = getAny . foldMap (Any . (\x -> p x))

-- Todas las básicas satisfacen el predicado.
allDib p = getAll . foldMap (All . (\x -> p x))

-- La descripción de cada constructor son sus tres primeros símbolos en minúscula.
-- Nota (Dani): Ver que Rotar y Rot45 dejarían la misma cadena, por eso las diferenciamos.

desc :: (a -> String) -> Dibujo a -> String
desc ff = sem f g h t k r b
        where f = \x -> "bas ("++ (ff x) ++")" 
              g = \x -> ("rot ("++) . (++")") $ x
              h = \x -> ("esp ("++) . (++")") $ x
              t = \x -> ("r45 ("++) . (++")") $ x
              k = \i1 i2 x1 x2 -> encadenar ("api ( "++ show i1 ++" "++ show i2 ++" (") (") (") (")") x1 x2
              r = \i1 i2 x1 x2 -> encadenar ("jun ( "++ show i1 ++" "++ show i2 ++" (") (") (") (")") x1 x2
              b = \x1 x2 -> encadenar ("enc (") (") (") (")") x1 x2
              encadenar beg mid end x1 x2  = beg ++ x1 ++ mid ++ x2 ++ end

-- Junta todas las figuras básicas de un dibujo.
every :: Dibujo a -> [a]
every = sem (\x -> [x]) id id id (\i1 i2 x1 x2 -> (++) x1 x2) (\i1 i2 x1 x2 -> (++) x1 x2) (\x1 x2 -> (++) x1 x2)

-- Cuenta la cantidad de veces que aparecen las básicas en una figura.
contar :: Eq a => Dibujo a -> [(a,Int)]
contar dd = zip unicos conteos
          where lista_basicos = every dd
                unicos = uniq lista_basicos
                conteos = length <$> [filter (x==) lista_basicos | x <- unicos]
                uniq = \xs -> wrapper [] xs
                     where wrapper done [] = done
                           wrapper done (x:xs) | elem x done = wrapper done xs
                                               | otherwise     = wrapper (x:done) xs
-- uniq es una función que remueve duplicados poniendo los que estan procesados en otra lista,
-- obedece a un patrón conocido en Haskell de acumular una lista u otra estrucutra según una cierta
-- propiedad.

-- PREDICADOS SOBRE FIGURAS

-- Pred (Dibujo a) ~ Dibujo a -> Bool
esRot360, esFlip2 :: Pred (Dibujo a)

-- Hay 4 rotaciones seguidas (empezando en el tope).
esRot360 (Basica x)  = False
esRot360 (Rotar x)   = case x of
                            (Rotar y) -> case y of
                                             (Rotar z) -> case z of
                                                              (Rotar w) -> True
                                                              _         -> esRot360 x
                                             _ -> esRot360 x
                            _         -> esRot360 x
esRot360 (Espejar x) = esRot360 x
esRot360 (Rot45 x)   = esRot360 x
esRot360 (Apilar i1 i2 x1 x2) = esRot360 x1 || esRot360 x2
esRot360 (Juntar i1 i2 x1 x2) = esRot360 x1 || esRot360 x2
esRot360 (Encimar x1 x2)      = esRot360 x1 || esRot360 x2

-- Hay 2 espejados seguidos (empezando en el tope).
esFlip2 (Basica x)  = False
esFlip2 (Rotar x)   = esFlip2 x
esFlip2 (Espejar x) = case x of
                           (Espejar y) -> True
                           _           -> esFlip2 x
esFlip2 (Rot45 x)   = esFlip2 x
esFlip2 (Apilar i1 i2 x1 x2) = esFlip2 x1 || esFlip2 x2
esFlip2 (Juntar i1 i2 x1 x2) = esFlip2 x1 || esFlip2 x2
esFlip2 (Encimar x1 x2)      = esFlip2 x1 || esFlip2 x2

-- FUNCIONES DE CHEQUEO DE ERRORES

-- Definición de función que aplica un predicado y devuelve un error indicando fallo o una figura si no hay el error.
-- La cadena que se toma como parámetro es la descripción del error.
check :: Pred (Dibujo a) -> String -> Dibujo a -> Either String (Dibujo a)
check p st_err dd | p dd      = Right dd
                  | otherwise = Left st_err

-- Aplica todos los chequeos y acumula todos los errores, sólo devuelve la figura si no hubo ningún error.
todoBien :: Dibujo a -> Either [String] (Dibujo a)
todoBien dd = if c then Left $ lefts checks else Right $ (head . rights) checks
            where ll = [check (not . esRot360) "Hay cuatro rotaciones seguidas.", check (not . esFlip2)  "Hay dos espejamientos seguidos."]
                  checks   = todoBien' dd ll
                            where todoBien' cc pp = map ($ cc) pp
                                  -- todoBien' :: t a -> [t a -> k b (t a)] -> [k b (t a)]
                  c = any isLeft checks

-- FUNCIONES CORRECTORAS DE ERRORES
-- Definir funciones que corrigen los errores detectados.

-- Ignora los siguientes constructores unarios especificados por el entero, excepto por Basica
-- Suponemos n >= 0
ignore :: Int -> Dibujo a -> Dibujo a
ignore 0 d@(_) = d
ignore _ d@(Basica x) = d
ignore 1 dd = case dd of
                   (Rotar x)   -> x
                   (Espejar x) -> x
                   (Rot45 x)   -> x
                   (Apilar i1 i2 x1 x2)  -> Apilar i1 i2 (ignore 1 x1) (ignore 1 x2)
                   (Juntar i1 i2 x1 x2)  -> Juntar i1 i2 (ignore 1 x1) (ignore 1 x2)
                   (Encimar x1 x2)       -> Encimar (ignore 1 x1) (ignore 1 x2)
                   _  -> dd
ignore n dd = case dd of
                   (Rotar x)   -> ignore (n-1) x
                   (Espejar x) -> ignore (n-1) x
                   (Rot45 x)   -> ignore (n-1) x
                   (Apilar i1 i2 x1 x2)  -> Apilar i1 i2 (ignore n x1) (ignore n x2)
                   (Juntar i1 i2 x1 x2)  -> Juntar i1 i2 (ignore n x1) (ignore n x2)
                   (Encimar x1 x2)       -> Encimar (ignore n x1) (ignore n x2)
                   _  -> dd

-- CorregirRot360 elimina las cuatro rotaciones seguidas en el tope.
corregirRot360, corregirFlip2 :: Dibujo a -> Dibujo a
corregirRot360 d@(Basica x) = d
corregirRot360 d@(Rotar x)  | alComienzo d = ignore 4 d
                            | otherwise    = Rotar $ corregirRot360 x
                            where alComienzo k = case k of
                                                     (Rotar w) -> case w of
                                                                      (Rotar v) -> case v of
                                                                                       (Rotar u) -> case u of
                                                                                                         (Rotar _) -> True
                                                                                                         _         -> False
                                                                                       _         -> False
                                                                      _         -> False
                                                     _         -> False
corregirRot360 (Espejar x)  = Espejar $ corregirRot360 x
corregirRot360 (Rot45 x)    = Rot45 $ corregirRot360 x
corregirRot360 (Apilar i1 i2 x1 x2) = Apilar i1 i2 (corregirRot360 x1) (corregirRot360 x2)
corregirRot360 (Juntar i1 i2 x1 x2) = Juntar i1 i2 (corregirRot360 x1) (corregirRot360 x2)
corregirRot360 (Encimar x1 x2)      = Encimar (corregirRot360 x1) (corregirRot360 x2)

-- CorregirFlip2 elimina el espejamiento doble en el tope.
corregirFlip2 d@(Basica x)  = d
corregirFlip2 (Rotar x)     = Rotar $ corregirFlip2 x
corregirFlip2 d@(Espejar x) | alComienzo d = ignore 2 d
                            | otherwise = Espejar $ corregirFlip2 x
                            where alComienzo k = case k of
                                                      (Espejar w) -> case w of
                                                                          (Espejar _) -> True
                                                                          _           -> False
                                                      _           -> False
corregirFlip2 (Rot45 x)     = Rot45 $ corregirFlip2 x
corregirFlip2 (Apilar i1 i2 x1 x2) = Apilar i1 i2 (corregirFlip2 x1) (corregirFlip2 x2)
corregirFlip2 (Juntar i1 i2 x1 x2) = Juntar i1 i2 (corregirFlip2 x1) (corregirFlip2 x2)
corregirFlip2 (Encimar x1 x2)      = Encimar (corregirFlip2 x1) (corregirFlip2 x2)

noRot360, noFlip2 :: Dibujo a -> Dibujo a

noRot360 dd | esRot360 dd = corregirRot360 dd
            | otherwise   = dd

noFlip2  dd | esFlip2 dd  = corregirFlip2 dd
            | otherwise   = dd

-- Deben satisfacer 
-- (1) check (not . esRot360) "Hay cuatro rotaciones seguidas" (noRot360 f) = Right f', para alguna f'.
-- (2) check (not . esFlip2) "Hay dos espejamientos seguidos" (noFlip2 f) = Right f', para alguna f'.
-- También
-- todoBien $ noRot360 . noFlip2 $ f' = Right f', para alguna f'.
