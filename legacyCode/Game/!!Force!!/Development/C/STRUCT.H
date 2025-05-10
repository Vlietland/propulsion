/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:      Structure definitie         (struct.h)         */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   In deze H-file staan alle structures die nodig zijn voor          */
/*   het gehele programma                                              */
/*                                                                     */
/*                                                                     */
/*                                                                     */
/* DATUM:                  2 februari 1997                             */
/*=====================================================================*/


#define	       bool              int
#define	       false              -1
#define	       true              255

struct Vector {float X,Y;};

struct Vectors {Vector ship,ball;};

