/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:	Beheert de shipkogeldata     (shpkogel.h)      */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*								       */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  12 april 1997                               */
/*=====================================================================*/
#include        <stdio.h> // vanwege NULL in de classe Shipkogels

#if !defined(_shpkogel_h_)
#define _shpkogel_h_

class Shipkogel // object kogel
{
 public:
   void        initkogel(vector position, vector velocity ,kogelbouwsteen *blokptr);
   kogelhit    calckogel();
   void        drawkogel();
   void        wipeoldkogel();

 private:
   vector         position;
   vector         velocity;
   kogelbouwsteen *startkogelptr;
   kogelbouwsteen *oldkogelptr;
   int            kogelsoort;
   bool           kogeltouch; // drawkogel set, calckogel check & reset

   intvec         olddrawposition;
};


struct kogelelement
  {
   Shipkogel kgl;
   kogelelement *volg;
  };


class Shipkogels
{
 public:
   void           initkogels();
   void           updatekogels();
   void	          drawkogels();
   void           wipeoldkogels();

 private:
   kogelelement   *startptr, **huidigptr; // huidigptr is een ptr naar een ptr

   void           listbegin() {huidigptr = &startptr;};
   void           createkogel();
   void           updatekogel();
   void           drawkogel();
   void           wipekogel();
                  listOK() {return (*huidigptr != NULL);};
   void           deletekogel();

   kogelbouwsteen kogelptr[kogelsoorten];
};

#endif  _shpkogel_h_