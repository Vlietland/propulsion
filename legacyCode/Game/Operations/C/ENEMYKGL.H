/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:	Classe kogel         	(kogel.h)	       */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*								       */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  12 april 1997                               */
/*=====================================================================*/

#if !defined(_enemykgl_h_)
#define _enemykgl_h_


class Enemykogel
{
 public:
   void       initkogels();
   void       updatekogels();
   void	      drawkogels();
   void       wipeoldkogels();

 private:
   void       updatekogel();
};

#endif  _enemykgl_h_