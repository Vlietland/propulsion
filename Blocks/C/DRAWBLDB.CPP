/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:	Zorgt voor de bouwsteenfiles (bouwmaak.cpp)    */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   Dit programma is een eenvoudig tekenprogramma om de blokken       */
/*   te tekenen voor Force					       */
/*								       */
/*   Let vooral op de coordinaten van de buffer. Deze zijn ver-        */
/*   wisseld omdat C++ een rij ziet als het meest achterste array      */
/*   gedeelte							       */
/*                                                                     */
/*								       */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                 11 februari 1997                             */
/*=====================================================================*/
#include	<stdio.h>
#include	<io.h>
#include	<FCNTL.H>
#include	<stdlib.h>
#include	<conio.h>
#include	<iostream.h>
#include	<dos.h>

#include	"bouwgeg.h"
#include	"..\..\gamehead\gamehead.h"

// ------------functies

keuzes getmuiscoor(intvec *position);

void   showmouse(void);
void   hidemouse(void);

bool   muisbinnenvlak(int Xmin, int Ymin,
		      int Xmax, int Ymax,
		      int Xmuis ,int Ymuis);

void   xswap();
void   yswap();
void   rotate90();

void   savebuffer();
void   loadbuffer();

void   updatescreen();
int    getcolors(intvec position);

void   maakstandaardkleuren();
void   screeninit    ();
void   restorescreen ();
void   tekengrootpunt(intvec position, int kleur);
void   tekenkleinpunt(intvec position, int kleur);
void   createbutton  (intvec punt, int color);


bouwsteen    buff,oldbuff;
FILE	     *fpsource;
int          nummer = 0;
int	     curcolor = 15;

void main(int argc, char *argv[])
  {
   intvec	position;
   int		keuze;
   int		arrayend = atoi(argv[2])- 1;

   if       (argc != 3)
     cout << "\n usage: " << argv[0] << "\n source !numer of blocks!" << "\n (block : 26 x 22 bytes)";

   else if ((fpsource = fopen(argv[1], "r+")) == NULL)
      cout << "\n cannot open file";

   else
     {
      setmode(fileno(fpsource), O_BINARY); // de stream wordt nu als binair behandeld
      fread (buff.blok, sizeof(buff), 1, fpsource);
      fseek   (fpsource, -bloklengte*blokhoogte, SEEK_CUR);
      savebuffer();
      screeninit();
      do{
	 keuze = getmuiscoor(&position);

	 if      (keuze == getcolor)
	   curcolor = getcolors(position);
	 else if (keuze == setcolor)
	   {
	    savebuffer();
	    buff.blok[(position.Sy-Ynulgroot)/4][(position.Sx-Xnulgroot)/4] = curcolor;
	   }
	 else if (keuze == back)
	   {
	    gotoxy(Xfile,Yfile+2);
	    cout << fwrite(buff.blok, sizeof(buff), 1, fpsource);
	    fseek   (fpsource, -bloklengte*blokhoogte, SEEK_CUR);
	    if (nummer > 0)
	      {
	       fseek (fpsource, -bloklengte*blokhoogte, SEEK_CUR);
	       nummer--;
	      }
	    gotoxy(Xfile,Yfile);
	    cout << fread (buff.blok, sizeof(buff), 1, fpsource);
	    fseek   (fpsource, -bloklengte*blokhoogte, SEEK_CUR);
	   }
	 else if (keuze == forward)
	   {
	    gotoxy(Xfile,Yfile+2);
	    cout << fwrite(buff.blok, sizeof(buff), 1, fpsource);
	    fseek   (fpsource, -bloklengte*blokhoogte, SEEK_CUR);
	    if (nummer < arrayend)
	      {
	       fseek (fpsource, bloklengte*blokhoogte, SEEK_CUR);
	       nummer++;
	      }
	    gotoxy(Xfile,Yfile);
	    cout << fread (buff.blok, sizeof(buff), 1, fpsource);
	    fseek   (fpsource, -bloklengte*blokhoogte, SEEK_CUR);
	   }
	 else if (keuze == undo)
	   loadbuffer();
	 else if (keuze == xmir)
	   xswap();
	 else if (keuze == ymir)
	   yswap();
	 else if (keuze == rotate)
	   rotate90();

	 updatescreen();
	}
      while (keuze != quit);

      restorescreen();
      fclose(fpsource);
     }
  }

//==================================================================

keuzes getmuiscoor(intvec *position)
{
 keuzes keuze = niksgekozen;
 int  knoppenstand;
 int  Xmuis,Ymuis;
 intvec muiscoor;
 bool binnenvlak;

 showmouse();

      do{
	 asm{
	     pusha
	     mov ax,3		/* bepaal de knoppenstand */
	     int 0x33
	     mov knoppenstand,bx
	     shr cx,1
	     mov Xmuis,cx
	     mov Ymuis,dx
	     popa
	    }
	}
      while ((knoppenstand != linkerknop_in) && (knoppenstand != links_rechts));

 muiscoor.Sx = Xmuis;
 muiscoor.Sy = Ymuis;

 *position = muiscoor;

      do{		/* mousepointer binnen tekenvlak */
	 binnenvlak = muisbinnenvlak(Xnulgroot,Ynulgroot,
				     Xnulgroot+4*bloklengte,Ynulgroot+4*blokhoogte,
				     Xmuis,Ymuis);
	 if (binnenvlak == true) {
				  keuze = setcolor;
				  break;
				 }
				/* mousepointer op de backbutton */
	 binnenvlak = muisbinnenvlak(Xback,Yback,
				     Xback+Xknop,Yback+Yknop,
				     Xmuis,Ymuis);
	 if (binnenvlak == true) {
				  keuze = back;
				  break;
				 }

			/* mousepointer op de forwardbutton */
	 binnenvlak = muisbinnenvlak(Xforward,Yforward,
				     Xforward+Xknop,Yforward+Yknop,
				     Xmuis,Ymuis);
	 if (binnenvlak == true) {
				  keuze = forward;
				  break;
				 }
			/* mousepointer op de quitbutton */
	 binnenvlak = muisbinnenvlak(Xquit,Yquit,
				     Xquit+Xknop,Yquit+Yknop,
				     Xmuis,Ymuis);
	 if (binnenvlak == true) {
				  keuze = quit;
				  break;
				 }

			/* mousepointer op de undobutton */
	 binnenvlak = muisbinnenvlak(Xundo,Yundo,
				     Xundo+Xknop,Yundo+Yknop,
				     Xmuis,Ymuis);
	 if (binnenvlak == true) {
				  keuze = undo;
				  break;
				 }

	 binnenvlak = muisbinnenvlak(Xxmir,Yxmir,
				     Xxmir+Xknop,Yxmir+Yknop,
				     Xmuis,Ymuis);
	 if (binnenvlak == true) {
				  keuze = xmir;
				  break;
				 }

	 binnenvlak = muisbinnenvlak(Xymir,Yymir,
				     Xymir+Xknop,Yymir+Yknop,
				     Xmuis,Ymuis);
	 if (binnenvlak == true) {
				  keuze = ymir;
				  break;
				 }

	 binnenvlak = muisbinnenvlak(Xrotate,Yrotate,
				     Xrotate+Xknop,Yrotate+Yknop,
				     Xmuis,Ymuis);
	 if (binnenvlak == true) {
				  keuze = rotate;
				  break;
				 }

	 binnenvlak = muisbinnenvlak(Xnulinit,Ynulinit,
				     Xnulinit+300,Ynulinit+50,
				     Xmuis,Ymuis);
	 if (binnenvlak == true) {
				  keuze = getcolor;
				  break;
				 }

	 else keuze = niksgekozen;

	}
      while (keuze == blind);	/* wordt nooit blind */

      do{
	 asm{
	     pusha
	     mov ax,3		/* bepaal de knoppenstand */
	     int 0x33
	     mov knoppenstand,bx
	     shr cx,1
	     mov Xmuis,cx
	     mov Ymuis,dx
	     popa
	    }
	}
      while (knoppenstand == linkerknop_in);

 delay(25);

 hidemouse();

 return(keuze);
}


bool muisbinnenvlak(int Xmin, int Ymin,
		    int Xmax, int Ymax,
		    int Xmuis ,int Ymuis)

  {
   if		/* muispointer binnen het vlak ?? */
     (
      (Xmuis >= Xmin) && (Ymuis >= Ymin) &&
      (Xmuis <= Xmax) && (Ymuis <= Ymax)
     )
      return(true);

   else return(false);
  }

void xswap()
  {
   bouwsteen tempbuff;
   intvec punt;

   for (punt.Sy = 0; punt.Sy < blokhoogte; punt.Sy++)
     for (punt.Sx = 0; punt.Sx < bloklengte; punt.Sx ++)
       tempbuff.blok[punt.Sy][punt.Sx] = buff.blok[punt.Sy][punt.Sx];

   for (punt.Sy = 0; punt.Sy < blokhoogte; punt.Sy++)
     for (punt.Sx = 0; punt.Sx < bloklengte; punt.Sx ++)
       buff.blok[punt.Sy][punt.Sx] = tempbuff.blok[punt.Sy][(bloklengte-1)-punt.Sx];
  }

void   yswap()
  {
   bouwsteen tempbuff;
   intvec punt;

   for (punt.Sy = 0; punt.Sy < blokhoogte; punt.Sy++)
     for (punt.Sx = 0; punt.Sx < bloklengte; punt.Sx ++)
       tempbuff.blok[punt.Sy][punt.Sx] = buff.blok[punt.Sy][punt.Sx];

   for (punt.Sy = 0; punt.Sy < blokhoogte; punt.Sy++)
     for (punt.Sx = 0; punt.Sx < bloklengte; punt.Sx ++)
       buff.blok[punt.Sy][punt.Sx] = tempbuff.blok[(blokhoogte-1)-punt.Sy][punt.Sx];
  }

void   rotate90()
  {
   bouwsteen tempbuff;
   intvec punt;

   for (punt.Sy = 0; punt.Sy < blokhoogte; punt.Sy++)
     for (punt.Sx = 0; punt.Sx < bloklengte; punt.Sx ++)
       {
	tempbuff.blok[punt.Sy][punt.Sx] = buff.blok[punt.Sy][punt.Sx];
	buff.blok[punt.Sy][punt.Sx] = 0;
       }

   for (punt.Sy = 0; punt.Sy < blokhoogte; punt.Sy++)
     for (punt.Sx = 0; punt.Sx < blokhoogte; punt.Sx ++)
       buff.blok[punt.Sx][punt.Sy+2] = tempbuff.blok[punt.Sy][punt.Sx+2];
  }

void   savebuffer()
  {
   intvec punt;

   for (punt.Sy = 0; punt.Sy < blokhoogte; punt.Sy++)
     for (punt.Sx = 0; punt.Sx < bloklengte; punt.Sx ++)
       oldbuff.blok[punt.Sy][punt.Sx] = buff.blok[punt.Sy][punt.Sx];
  }


void   loadbuffer()
  {
   intvec punt;

   for (punt.Sy = 0; punt.Sy < blokhoogte; punt.Sy++)
     for (punt.Sx = 0; punt.Sx < bloklengte; punt.Sx ++)
       buff.blok[punt.Sy][punt.Sx] = oldbuff.blok[punt.Sy][punt.Sx];
  }
//==================================================================

void showmouse(void)

  {
   asm{
       pusha
       mov ax,1		/* show mouse */
       int 0x33
       popa
      }
  }


void hidemouse(void)

  {
   asm{
       pusha
       mov ax,2		/* hide mouse */
       int 0x33
       popa
      }
  }

/*-----------------------------------------------------------------*/
void screeninit()
  {
   intvec punt;

   asm{
       pusha
       mov	ah,0x00			//set videomode
       mov	al,0x13			//VGA
       int	   0x10			//call bios
       popa
      }

   maakstandaardkleuren();
   punt.Sx = Xback;
   punt.Sy = Yback;
   createbutton(punt,blauw);
   punt.Sx = Xforward;
   punt.Sy = Yforward;
   createbutton(punt,blauw);
   punt.Sx = Xquit;
   punt.Sy = Yquit;
   createbutton(punt,rood);
   punt.Sx = Xundo;
   punt.Sy = Yundo;
   createbutton(punt,groen);
   punt.Sx = Xxmir;
   punt.Sy = Yxmir;
   createbutton(punt,lichtcyan);
   punt.Sx = Xymir;
   punt.Sy = Yymir;
   createbutton(punt,lichtcyan);
   punt.Sx = Xrotate;
   punt.Sy = Yrotate;
   createbutton(punt,cyan);

   updatescreen();
  }


void  updatescreen()
  {
   intvec grootpunt;
   intvec kleinpunt;
   intvec punt;
   char   color;

   for (punt.Sy = 0; punt.Sy < blokhoogte; punt.Sy++)
     {
      for (punt.Sx = 0; punt.Sx < bloklengte; punt.Sx++)
	{
	 color = buff.blok[punt.Sy][punt.Sx];
	 grootpunt.Sx = (4*punt.Sx+Xnulgroot);
	 grootpunt.Sy = (4*punt.Sy+Ynulgroot);
	 tekengrootpunt(grootpunt,color);

	 kleinpunt.Sx = (punt.Sx+Xnulklein);
	 kleinpunt.Sy = (punt.Sy+Ynulklein);
	 tekenkleinpunt(kleinpunt,color);
	}
     }

   punt.Sx = Xnulsam;
   punt.Sy = Ynulsam;
   tekengrootpunt(punt,curcolor);
   punt.Sx = Xnulsam+4;
   punt.Sy = Ynulsam;
   tekengrootpunt(punt,curcolor);
   punt.Sx = Xnulsam;
   punt.Sy = Ynulsam+4;
   tekengrootpunt(punt,curcolor);
   punt.Sx = Xnulsam+4;
   punt.Sy = Ynulsam+4;
   tekengrootpunt(punt,curcolor);
   gotoxy(Xnummer,Ynummer);
   cout << "   ";
   gotoxy(Xnummer,Ynummer);
   cout << nummer;
  }


int getcolors(intvec position)
  {
   int color;

	asm{
		pusha
		push	ds	// bij pusha word ds niet gesaved

		MOV	ax,0xA000
		MOV	ds,ax

		MOV	ax, word ptr position.Sy
		MOV	bx,screenlengte
		MUL	bx

		ADD	ax, word ptr position.Sx

		MOV	di,ax
		MOV	cx,0
		MOV	cl,[di]
		MOV	word ptr color,cx

		pop	ds
		popa
	   }
   return(color);
  }


void maakstandaardkleuren()
  {
   intvec punt;
   intvec grootpunt;
   intvec kleinpunt;
   int color = 0;

   punt.Sy = Ynulinit;

   for (punt.Sx = Xnulinit; punt.Sx < 138; punt.Sx +=4)
     {
      tekengrootpunt(punt,color);
      color++;
     }
   punt.Sy += 8;

   for (int regel = 0; regel < 3; regel++)
     {
      for (punt.Sx = Xnulinit; punt.Sx < 298; punt.Sx +=4)
	{
	 tekengrootpunt(punt,color);
	 color++;
	}
      punt.Sy += 8;
     }

   color = 4;
   for (punt.Sy = -1; punt.Sy < blokhoogte + 1; punt.Sy++)
     {
      for (punt.Sx = -1; punt.Sx < bloklengte + 1; punt.Sx++)
	{
	 grootpunt.Sx = (4*punt.Sx+Xnulgroot);
	 grootpunt.Sy = (4*punt.Sy+Ynulgroot);
	 tekengrootpunt(grootpunt,color);

	 kleinpunt.Sx = (punt.Sx+Xnulklein);
	 kleinpunt.Sy = (punt.Sy+Ynulklein);
	 tekenkleinpunt(kleinpunt,color);
	}
     }
  }


void tekenkleinpunt(intvec position, int kleur)
  {
	asm{
		pusha
		push	ds	// bij pusha word ds niet gesaved

		MOV	ax,0xA000
		MOV	ds,ax

		MOV	ax,word ptr position.Sy
		MOV	bx,screenlengte
		MUL	bx

		ADD	ax,word ptr position.Sx

		MOV	di,ax
		MOV	cx,kleur

		MOV	[di],cl
		pop	ds
		popa
	   }
  }


void tekengrootpunt(intvec position, int kleur)
  {
	asm{
		pusha
		push	ds	// bij pusha word ds niet gesaved

		MOV	ax,0xA000
		MOV	ds,ax

		MOV	ax,word ptr position.Sy
		MOV	bx,screenlengte
		MUL	bx

		ADD	ax,word ptr position.Sx

		MOV	di,ax
		MOV	cx,kleur
		MOV	ch,cl
		MOV	dx,0
	   }
   newline:
	asm{
		MOV	[di   ],cx
		MOV	[di+ 2],cx
		ADD	di,screenlengte

		INC	dx
		CMP	dx,4
		JNZ	newline

		pop	ds
		popa
	   }
  }


void restorescreen()
  {

   asm{
       pusha
       mov	ah,0x00			//set videomode
       mov	al,0x02			//VGA
       int	0x10			//call bios
       popa
      }
  }

void createbutton(intvec punt, int color)
  {
   intvec beginpunt = punt;

   for (int lengte = 0; lengte< Xknop; lengte +=4)
     for (int hoogte = 0; hoogte< Yknop; hoogte +=4)
       {
	punt.Sx = beginpunt.Sx + lengte;
	punt.Sy = beginpunt.Sy + hoogte;
	tekengrootpunt(punt,color);
       }
  }