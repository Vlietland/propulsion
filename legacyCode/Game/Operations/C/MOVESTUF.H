/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:	Beheert de blokkenopbouw    (movestuf.h)       */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   Deze h-file bevat de header voor de class movestuff               */
/*                                                                     */
/*								       */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                 20 maart 1997                                */
/*=====================================================================*/

#if !defined(_movestuf_h_)
#define _movestuf_h_

class Movestuff
  {
   public:
     void  drawsteady(intvec schermposition, bouwsteen *blokptr);
     void  drawpart(intvec schermposition, intvec poscoormod, bouwsteen *blokptr);
     int   drawbig(intvec schermposition, bouwsteen *blokptr);
     int   drawsmall(intvec schermposition, kogelbouwsteen *blokptr);

     void  wipebig(intvec schermposition, bouwsteen *blokptr);
     void  wipesmall(intvec schermposition, kogelbouwsteen *blokptr);
   private:
  };

#endif _movestuf_h_