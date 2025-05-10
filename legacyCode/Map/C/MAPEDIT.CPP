/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:	Beheert de schermopbouw (screen.cpp)	       */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   Met dit programma is het mogelijk om een map de tekenen	       */
/*   Het programma is heel eenvoudig				       */
/*   * de build.mix file wordt in een array geladen		       */
/*   * de editlevelfile wordt in een array geladen		       */
/*   * met de muis kunnen de gewenste veranderingen in de map 	       */
/*     aangebracht worden					       */
/*   * bij quit wordt de nieuwe map gesaved (dit is linksboven (0,0))  */
/*								       */
/*   Let op de blokarray, bij een blok is de X en Y coordinaat         */
/*   omgedraaid omdat C++ het achterste coordinaat als Xcoordinaat     */
/*   ziet						               */
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


#include	"..\..\gamehead\gamehead.h"
#include	"mapgeg.h"
#include	"mapedit.hft"


bool   initbouwstenen();
void   screeninit    ();
void   restorescreen ();

keuzes getmuiscoor(intvec *position);

void   updatescreen();
void   maprowload();

int    getblocks(intvec position);
void   setblocks(intvec position, int blocknummer);
void   drawblocknumber(intvec screenposition, int blocknummer);
char   getbyte(); // zorgt voor het ophalen van een byte

// globale variabelen
bouwsteen  far	blokarray[soorten];		// build.mix
mappiece   far	map[maplengte][maphoogte];	// levelx.mix
char		blockrow[Yaantalblokken];	// rechterrij (getblocks)

intvec		basismapcoor     = {0,0};

char		basisblockwijzer = 0;
char		curblocksoort    = 0;		// het huidige gekozen block

// undo variabelen
mappiece	undoblock;
intvec		undoposition = {0,0};


void main(int argc, char *argv[])
  {
   FILE	    *fpsource, *fpdestination;
   intvec   position;
   int	    keuze;

//   argc = 3;
//   argv[1] = "level1.mix";
//   argv[2] = "level1.new";

   if  (argc != 3)
     cout << "usage: " << argv[0] << " sourcemapname newmapname";
   else if ((fpsource = fopen(argv[1], "r")) == NULL)
      cout << "cannot open file";
   else if (fseek(fpsource, 0, SEEK_SET) == !0)
      cout << "seek errors";
   else if ((fpdestination = fopen(argv[2], "w")) == NULL)
      cout << "cannot open file";
   else if (fseek(fpdestination, 0, SEEK_SET) == !0)
      cout << "seek errors";
   else
    {
     setmode(fileno(fpsource), O_BINARY);      // de stream wordt nu als binair behandeld
     setmode(fileno(fpdestination), O_BINARY); // de stream wordt nu als binair behandeld

     if (fread(map, sizeof(mappiece), maplengte*maphoogte, fpsource) != maplengte*maphoogte)
       cout << "end of file detected";
     else if (!(initbouwstenen()))
       cout << "build.mix errors";
     else
       {
	fclose(fpsource);
	maprowload    ();
	screeninit    ();
	undoblock.soort  = 0;
	undoblock.damage = 0;
	undoblock.status = 0;
	undoblock.Xextra = 0;
	undoblock.Yextra = 0;
        undoblock.Zextra = 0;

	do{
	   keuze = getmuiscoor(&position);

	   if      (keuze == getblok)
	     curblocksoort = getblocks(position);
	   else if (keuze == setblok)
	     setblocks(position,curblocksoort);
	   else if (keuze == shiftup)
	     {
	      if (basismapcoor.Sy > 0) basismapcoor.Sy--;
	     }
	   else if (keuze == shiftdown)
	     {
	      if (basismapcoor.Sy < (maphoogte - Yaantalblokken))  basismapcoor.Sy++;
	     }
	   else if (keuze == shiftleft)
	     {
	      if (basismapcoor.Sx > 0) basismapcoor.Sx--;
	     }
	   else if (keuze == shiftright)
	     {
	      if (basismapcoor.Sx < (maplengte - Xaantalblokken))  basismapcoor.Sx++;
	     }
	   else if (keuze == shiftrowup)
	     {
	      if (basisblockwijzer > 0)
		{
		 while (checksubblok(basisblockwijzer-1))
		   basisblockwijzer --;
		 basisblockwijzer--;
		 maprowload();
		}
	     }
	   else if (keuze == shiftrowdown)
	     {
	      if (basisblockwijzer < soorten - Yaantalblokken)
		{
		 while (checksubblok(basisblockwijzer+1))
		   basisblockwijzer ++;
		 basisblockwijzer++;
		 maprowload();
		}
	     }
	   else if (keuze == undo)
	     map[undoposition.Sx][undoposition.Sy] = undoblock;

	   updatescreen();
	  }
	while (keuze != quit);

	if (fwrite(map, sizeof(mappiece), maplengte*maphoogte, fpdestination) != maplengte*maphoogte)
	  cout << "write errors";

	fclose(fpdestination);
	restorescreen();
       }
    }
  }


void   maprowload()
  {
   // let op bij het nummeren van de blokken dat de laatste blokken
   // zonder gaten gekozen moeten worden (dus hier geen bewegende blokken)
   // dit omdat er altijd vanaf de basisblockwijzer 7 volgende blokken
   // gezocht worden om de maprow te vullen

   char blockwijzer = basisblockwijzer;
   int rijteller;

   for (rijteller = 0; rijteller < Yaantalblokken; rijteller++)
     {
      while (checksubblok(blockwijzer))
	blockwijzer ++;
      blockrow[rijteller] = blockwijzer++;
     }
  }


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

      do{
			/* mousepointer op shiftupdomein */
	 binnenvlak = muisbinnenvlak(Xshiftleft,Yoffset,
				     Xshiftright,Yshiftup,
				     Xmuis,Ymuis);
	 if (binnenvlak == true) {
				  keuze = shiftup;
				  break;
				 }
			/* mousepointer op shiftdowndomein */
	 binnenvlak = muisbinnenvlak(Xshiftleft,Yshiftdown,
				     Xshiftright,screenhoogte,
				     Xmuis,Ymuis);
	 if (binnenvlak == true) {
				  keuze = shiftdown;
				  break;
				 }
			/* mousepointer op shiftleftdomein */
	 binnenvlak = muisbinnenvlak(0,Yshiftup,
				     Xshiftleft,Yshiftdown,
				     Xmuis,Ymuis);
	 if (binnenvlak == true) {
				  keuze = shiftleft;
				  break;
				 }

			/* mousepointer op shiftrightdomein */
	 binnenvlak = muisbinnenvlak(Xshiftright,Yshiftup,
				     Xshiftrow,Yshiftdown,
				     Xmuis,Ymuis);
	 if (binnenvlak == true) {
				  keuze = shiftright;
				  break;
				 }

			/* mousepointer op shiftrowupdomein */
	 binnenvlak = muisbinnenvlak(Xshiftrow,Ygetoffset,
				     screenlengte,Yshiftrowup,
				     Xmuis,Ymuis);
	 if (binnenvlak == true) {
				  keuze = shiftrowup;
				  break;
				 }

			/* mousepointer op shiftrowdowndomein */
	 binnenvlak = muisbinnenvlak(Xshiftrow,Yshiftrowdown,
				     screenlengte,screenhoogte,
				     Xmuis,Ymuis);
	 if (binnenvlak == true) {
				  keuze = shiftrowdown;
				  break;
				 }

			/* mousepointer op het setblockvlak */
	 binnenvlak = muisbinnenvlak(Xshiftleft+1,Yshiftup+1,
				     Xshiftright-1,Yshiftdown-1,
				     Xmuis,Ymuis);
	 if (binnenvlak == true) {
				  keuze = setblok;
				  break;
				 }

			/* mousepointer op het getblockvlak */
	 binnenvlak = muisbinnenvlak(Xshiftrow,Ygetoffset,
				     screenlengte,Yshiftdown-1,
				     Xmuis,Ymuis);
	 if (binnenvlak == true) {
				  keuze = getblok;
				  break;
				 }

			/* mousepointer op het undovlak */
	 binnenvlak = muisbinnenvlak(Xshiftrow,0,
				     screenlengte,Yoffset,
				     Xmuis,Ymuis);
	 if (binnenvlak == true) {
				  keuze = undo;
				  break;
				 }


			/* mousepointer op quitdomein */
	 binnenvlak = muisbinnenvlak(0,0,
				     Xquit,Yquit,
				     Xmuis,Ymuis);
	 if (binnenvlak == true) {
				  keuze = quit;
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

   delay(20);

   hidemouse();

   return(keuze);
  }

//==================================================================

void screeninit()
  {
   intvec punt = {Xshiftrow-3,0};

   asm{
       pusha
       mov	ah,0x00			//set videomode
       mov	al,0x13			//VGA
       int	   0x10			//call bios
       popa
      }

   for (punt.Sy = 0; punt.Sy < screenhoogte; punt.Sy ++)
     tekenkleinpunt(punt,rood);

   punt.Sx++;
   for (punt.Sy = 0; punt.Sy < screenhoogte; punt.Sy ++)
     tekenkleinpunt(punt,rood);

   punt.Sy = Yoffset-3;
   for (punt.Sx = 0; punt.Sx < Xshiftrow-3; punt.Sx ++)
     tekenkleinpunt(punt,rood);

   punt.Sy++;
   for (punt.Sx = 0; punt.Sx < Xshiftrow-3; punt.Sx ++)
     tekenkleinpunt(punt,rood);

   punt.Sy = Ygetoffset;
   for (punt.Sx = Xshiftrow-3; punt.Sx < screenlengte; punt.Sx ++)
     tekenkleinpunt(punt,rood);

   updatescreen();
  }


void updatescreen()
  {
   intvec position;
   intvec screenposition;
   intvec mapcoor;
   char   mapblocksoort;
   char   maprowsoort;

   gotoxy(Xmapcoor,Ymapcoor);
     cout << "        ";
   gotoxy(Xmapcoor,Ymapcoor);
     cout << basismapcoor.Sx << " , " << basismapcoor.Sy;

   gotoxy(Xmaprow,Ymaprow);
     cout << "    ";
   gotoxy(Xmaprow,Ymaprow);
     cout << int (basisblockwijzer);

   for (position.Sy = 0; position.Sy < Yaantalblokken; position.Sy++)
     {
     for (position.Sx = 0; position.Sx < Xaantalblokken; position.Sx++)
	{
	 screenposition.Sx = position.Sx * bloklengte;
	 screenposition.Sy = position.Sy * blokhoogte;
	 mapblocksoort     = map[basismapcoor.Sx+position.Sx][basismapcoor.Sy+position.Sy].soort;
	 drawblocknumber(screenposition,mapblocksoort);
	}
     }
   for (position.Sy = 0; position.Sy < Yaantalblokken-1; position.Sy++)
     {
      screenposition.Sx = Xshiftrow;
      screenposition.Sy = position.Sy * blokhoogte + (Ygetoffset - Yoffset + 1);
      maprowsoort = blockrow[position.Sy];
      drawblocknumber(screenposition,maprowsoort);
     }

   screenposition.Sx = Xsam;
   screenposition.Sy = Ysam;
   drawblocknumber(screenposition,curblocksoort);
  }


int  getblocks(intvec position)
  {
   int blocksoort = blockrow[(position.Sy-Ygetoffset)/blokhoogte];

   return(blocksoort);
  }


void setblocks(intvec position, int blocksoort)
  {
   intvec mapcoor;
   keuzes keuze;
   mappiece block;

   block.damage = 0;
   block.status = 0;
   block.Xextra = 0;
   block.Yextra = 0;

   mapcoor.Sx =  (position.Sx/bloklengte) + basismapcoor.Sx;
   mapcoor.Sy = ((position.Sy-Yoffset)/blokhoogte) + basismapcoor.Sy;

   block.soort = blocksoort;

   if      ((blocksoort >= buttonoutbegin) && (blocksoort <= buttonoutend))
     {
      gotoxy(Xmessage,Ymessage);
      cout << "point targetlaser";

      while (getmuiscoor(&position) != setblok);

      block.Xextra = ( position.Sx            / bloklengte) + basismapcoor.Sx;
      block.Yextra = ((position.Sy - Yoffset) / blokhoogte) + basismapcoor.Sy;

      if      (map[block.Xextra][block.Yextra].soort == laserleft) // button moet naar laserright of naar laserdown wijzen
	while ((map[block.Xextra][block.Yextra].soort != laserright) && (block.Xextra > 0))
	  block.Xextra--;

      else if (map[block.Xextra][block.Yextra].soort == laserup)   // button moet naar laserright of naar laserdown wijzen
	while ((map[block.Xextra][block.Yextra].soort != laserdown) && (block.Yextra > 0))
	  block.Yextra--;

      else if ((map[block.Xextra][block.Yextra].soort != laserdown) &&
	       (map[block.Xextra][block.Yextra].soort != laserright))
	block.soort = map[mapcoor.Sx][mapcoor.Sy].soort;

      gotoxy(Xmessage,Ymessage);
      cout << "                   ";
     }
   else if (blocksoort == fueltankbegin)
      block.Xextra = fuelamount;

   else if (blocksoort == energypodbegin)
      block.Xextra = energyamount;

   else if ((blocksoort >= turretbegindown) && (blocksoort <= turretendright))
      {
       gotoxy(Xmessage,Ymessage);
       cout << "firerate(xx)? : ";

       block.Xextra = getbyte();
       gotoxy(Xmessage,Ymessage);
       cout << "                    ";
      }

   else if ((blocksoort >= turret2begin) && (blocksoort <= turret2end))
      {
       gotoxy(Xmessage,Ymessage);
       cout << "firerate(xx)? : ";

       block.Xextra = getbyte();
       gotoxy(Xmessage,Ymessage);
       cout << "                    ";
      }

   else if ((blocksoort == star1begin)   || (blocksoort == star2begin))
      block.Xextra = block.Yextra = random(8)+1;

   else if (blocksoort == laserdown)
      {
       gotoxy(Xmessage,Ymessage);
       cout << "space->blue laser";
       if (getch() == ' ') block.Xextra = laserbluevert;
       else block.Xextra = laserredvert;
       gotoxy(Xmessage,Ymessage);
       cout << "                   ";
      }
   else if (blocksoort == laserright)
      {
       gotoxy(Xmessage,Ymessage);
       cout << "space->blue laser";
       if (getch() == ' ') block.Xextra = laserbluehor;
       else block.Xextra = laserredhor;
       gotoxy(Xmessage,Ymessage);
       cout << "                   ";
      }

   undoblock = map[mapcoor.Sx][mapcoor.Sy];
   undoposition = mapcoor;

   map[mapcoor.Sx][mapcoor.Sy] = block;
  }


void drawblocknumber(intvec screenposition, int blocksoort)
  {
   bouwsteen *buildptr;

   buildptr = &blokarray[blocksoort];

   drawblok(screenposition, buildptr);
  }


bool initbouwstenen()
  {
   FILE	       *fpbouwsteen;
   char	       *arg = {"build.mix"};
   bool	       status = true;

   if ((fpbouwsteen = fopen(arg, "r")) == NULL)
     status = false;
   else if (fseek(fpbouwsteen, 0, SEEK_SET) == !0)
     status = false;
   else
     {
      setmode(fileno(fpbouwsteen), O_BINARY); // de stream wordt nu als binair behandeld
      if (fread(blokarray, sizeof(bouwsteen), soorten, fpbouwsteen) != soorten)
	status = false;
      fclose(fpbouwsteen);
     }
   return (status);
  }


void   restorescreen ()
  {
   asm{
       pusha
       mov	ah,0x00			//set videomode
       mov	al,0x03			//VGA
       int	   0x10			//call bios
       popa
      }
  }


char getbyte()
  {
   char byte;
   byte = getch() - '0';
   if (byte < 0) byte = 0;
   byte *=10;
   byte += (getch() - '0');
   byte = byte & 0x00FF;

   cout << (unsigned int)byte;
   getch();
   return(byte);
  }