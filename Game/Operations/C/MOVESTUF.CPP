/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:	Beheert de blokkenopbouw (Movestuf.cpp)	       */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   Deze classe houdt zich bezig met de schermopbouw van de blokken   */
/*								       */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                 11 februari 1997                             */
/*=====================================================================*/
#include	"..\gamehead\gamehead.h"
#include        "!!forc~1\c\constant.h"
#include        "!!forc~1\c\enum.h"
#include        "!!forc~1\c\screen.h"

#include	"operat~1\c\movestuf.cnt"
#include	"operat~1\c\movestuf.h"
#include	"operat~1\c\movestuf.hft"

void Movestuff::drawsteady(intvec screenposition, bouwsteen *blok)
  {
        asm{
		pusha
		push	ds				// ds wordt bij pusha niet gesaved
                push    es

		mov	ax, word ptr blok + 2
		mov	ds,ax
		mov	ax, word ptr blok
		mov	si,ax

		mov	ax, basisscreenadres
		mov	es,ax

		mov	ax,word ptr screenposition.Sy
		mov	bx,screenlengte  	        // schermposition.Y * 320
		mul	bx

		add	ax,word ptr screenposition.Sx	// schermposition.X

                add     ax, offsetadres                 // offsetadres
		mov	di,ax

		cld

		mov	dx,blokhoogte
	   }
      nextline:
	asm{
		mov     cx,bloklengte/2
		REP MOVSW

		add	di,screenlengte - bloklengte
		dec	dx
		jnz	nextline

                pop	es
		pop	ds
		popa
	   }
  }

void Movestuff::drawpart(intvec screenposition, intvec poscoormod, bouwsteen *blok)
  // kopieert een deel van een blok op het scherm
  {
   intvec stappen     = {bloklengte,blokhoogte};

   if      (screenposition.Sx < 0)
     {
      stappen.Sx -= poscoormod.Sx;                      // deel van het blok kopieren
      screenposition.Sx = 0;
      asm { push ax
            mov  ax, word ptr poscoormod.Sx
            add  word ptr blok, ax                      // offset aan het blok toevoegen
            pop  ax }
     }

   else if (screenposition.Sx > ((Xblokken -1) * bloklengte))
     stappen.Sx = poscoormod.Sx;

   if      (screenposition.Sy < 0)
     {
      stappen.Sy -= poscoormod.Sy;
      screenposition.Sy = 0;
      int temp = poscoormod.Sy * bloklengte;
      asm { push ax
            mov  ax, word ptr temp
            add  word ptr blok, ax                      // offset aan het blok toevoegen
            pop  ax }
     }
   else if (screenposition.Sy > ((Yblokken -1) * blokhoogte))
     stappen.Sy = poscoormod.Sy;

   int Xblokspring   = bloklengte - stappen.Sx;         // om si goed in te stellen
   int Xscreenspring = screenlengte -  stappen.Sx;

            asm{
		pusha
		push	ds				// ds wordt bij pusha niet gesaved
                push    es

		mov	ax, word ptr blok + 2
		mov	ds,ax
		mov	ax, word ptr blok
		mov	si,ax

		mov	ax, basisscreenadres
		mov	es,ax

		mov	ax, word ptr screenposition.Sy
		mov	bx,screenlengte  	        // schermposition.Y * 320
		mul	bx

		add	ax, word ptr screenposition.Sx	// schermposition.X

                add     ax, offsetadres                 // offsetadres
		mov	di,ax

                cmp     word ptr stappen.Sy,0
                jz      nocopy
                cmp     word ptr stappen.Sx,0
                jz      nocopy

                cld
		mov	dx,word ptr stappen.Sy
	       }
   nextline:asm{
		mov     cx,word ptr stappen.Sx
                shr     cx,1                            // vanwege rep movsW
		REP MOVSW
                add     si, word ptr Xblokspring        // spring naar volgende blokregel

		add	di, Xscreenspring               // spring naar volgende screenregel
		dec	dx
		jnz	nextline
               }
   nocopy:  asm{
                pop     es
		pop	ds
		popa
	       }
  }

int Movestuff::drawbig(intvec screenposition, bouwsteen *blok)
  {
   int hitcounter = 0;

            asm{
		pusha
		push	ds				// ds wordt bij pusha niet gesaved

		mov	ax, word ptr blok + 2
		mov	ds,ax
		mov	ax, word ptr blok
		mov	si,ax

		mov	ax, basisscreenadres
		mov	es,ax

		mov	ax, word ptr screenposition.Sy
                sub     ax, blokhoogte /2
		mov	bx, screenlengte  	        // schermposition.Y * 320
		mul	bx

		add	ax, word ptr screenposition.Sx	// schermposition.X
                sub     ax, bloklengte /2

                add     ax, offsetadres                 // offsetadres
		mov	di,ax

		mov	dx,blokhoogte
	       }
   nextline:asm{
                mov     cx,bloklengte/2
               }
  nextpixel:asm{
                mov     ax,[si]                         // neem een pixel
                or      ax,ax                           // bij nul naar nopixel
                jz      nopixel
                mov     bx,es:[di]                      // iets geraakt
                or      bx,bx
                jz      nohit
                inc     hitcounter
                jmp     nopixel
               }
   nohit:   asm{
                mov     es:[di],ax
               }
   nopixel: asm{
                add     si,2
                add     di,2
                dec     cx
                jnz     nextpixel

		add	di,screenlengte - bloklengte
		dec	dx
		jnz	nextline

		pop	ds
		popa
	}
   return(0);
//   return(hitcounter);
  }

int Movestuff::drawsmall(intvec screenposition, kogelbouwsteen *blok)
  {
   int hitcounter = 0;
            asm{
		pusha
		push	ds				// ds wordt bij pusha niet gesaved

		mov	ax, word ptr blok + 2
		mov	ds,ax
		mov	ax, word ptr blok
		mov	si,ax

		mov	ax, basisscreenadres
		mov	es,ax

		mov	ax, word ptr screenposition.Sy
                sub     ax, blokkogelhoogte /2
		mov	bx, screenlengte  	        // schermposition.Y * 320
		mul	bx

		add	ax, word ptr screenposition.Sx	// schermposition.X
                sub     ax, blokkogellengte /2

                add     ax, offsetadres                 // offsetadres
		mov	di,ax

		mov	dx,blokkogelhoogte
	       }
   nextline:asm{
                mov     cx,blokkogellengte/2
               }
  nextpixel:asm{
                mov     ax,[si]                         // neem een pixel
                or      ax,ax                           // bij nul naar nopixel
                jz      nopixel
                mov     bx,es:[di]                      // iets geraakt
                or      bx,bx
                jz      nohit
                inc     hitcounter
                jmp     nopixel
               }
   nohit:   asm{
                mov     es:[di],ax
               }
   nopixel: asm{
                add     si,2
                add     di,2
                dec     cx
                jnz     nextpixel

		add	di,screenlengte - blokkogellengte
		dec	dx
		jnz	nextline

		pop	ds
		popa
	}

   return(hitcounter);
  }

void Movestuff::wipebig(intvec screenposition, bouwsteen *blok)
  {
	asm{
		pusha
		push	ds				// ds wordt bij pusha niet gesaved

		mov	ax, word ptr blok + 2
		mov	ds,ax
		mov	ax, word ptr blok
		mov	si,ax

		mov	ax, basisscreenadres
		mov	es,ax

		mov	ax, word ptr screenposition.Sy
                sub     ax, blokhoogte /2
		mov	bx, screenlengte  	        // schermposition.Y * 320
		mul	bx

		add	ax, word ptr screenposition.Sx	// schermposition.X
                sub     ax, bloklengte /2

                add     ax, offsetadres                 // offsetadres
		mov	di,ax
                mov     bx,0

		mov	dx,blokhoogte
	   }
      nextline:
	asm{
                mov     cx,bloklengte/2
           }
      nextpixel:
        asm{
                mov     ax,[si]
                or      ax,ax
                jz      nopixel
                mov     es:[di],bx
           }
      nopixel:
        asm{
                add     si,2
                add     di,2
                dec     cx
                jnz     nextpixel

		add	di,screenlengte - bloklengte
		dec	dx
		jnz	nextline

		pop	ds
		popa
	}
  }

void Movestuff::wipesmall(intvec screenposition, kogelbouwsteen *blok)
  {
	asm{
		pusha
		push	ds				// ds wordt bij pusha niet gesaved

		mov	ax, word ptr blok + 2
		mov	ds,ax
		mov	ax, word ptr blok
		mov	si,ax

		mov	ax, basisscreenadres
		mov	es,ax

		mov	ax, word ptr screenposition.Sy
                sub     ax, blokkogelhoogte /2
		mov	bx, screenlengte  	        // schermposition.Y * 320
		mul	bx

		add	ax, word ptr screenposition.Sx	// schermposition.X
                sub     ax, blokkogellengte /2

                add     ax, offsetadres                 // offsetadres
		mov	di,ax
                mov     bx,0

		mov	dx,blokkogelhoogte
	   }
      nextline:
	asm{
                mov     cx,blokkogellengte/2
           }
      nextpixel:
        asm{
                mov     ax,[si]
                or      ax,ax
                jz      nopixel
                mov     es:[di],bx
           }
      nopixel:
        asm{
                add     si,2
                add     di,2
                dec     cx
                jnz     nextpixel

		add	di,screenlengte - blokkogellengte
		dec	dx
		jnz	nextline

		pop	ds
		popa
	}

  }


