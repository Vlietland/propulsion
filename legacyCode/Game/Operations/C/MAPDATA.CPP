/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:      Map manager    (Mapdata.cpp)                   */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   In deze file staan de functies voor het managen van de map	       */
/*   De map bestaat uit een twee-dimentionale array die		       */
/*   uit kleine structures bestaan.                                    */
/*   Elk structure heeft informatie over een overeenkomstig            */
/*   blokje op het scherm                                              */
/*   (let op, de word alignment in het options-compiler menu moet      */
/*    uit staan omdat anders de sizeofroutine afrond op even           */
/*    getallen)                                                        */
/*                                                                     */
/*                                                                     */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                 21 maart 1997                                */
/*=====================================================================*/
#include        <iostream.h>
#include        <conio.h>
#include        <io.h>
#include        <fcntl.h>
#include        <stdio.h>
#include        <process.h>
#include        <math.h>

#include	"..\gamehead\gamehead.h"
#include        "!!forc~1\c\constant.h"
#include        "!!forc~1\c\enum.h"
#include        "!!forc~1\c\screen.h"

#include        "!!forc~1\c\classen.h"
#include	"operat~1\c\mapdata.cnt"

static Builddata far build;           // met een truc meer dan 64 k data
                                      // aanmaken
#include	"operat~1\c\mapdata.hft"

void Mapdata::initmap()
  {
   FILE		*buildfile;
   FILE		*mapfile;
   char		*buildnaam = {"build.mix"};
   char		*mapnaam   = {"level1.mix"};

   if ((buildfile = fopen(buildnaam, "r")) == NULL)
     { cout << "cannot open file"; exit(-1); }
   else if (fseek(buildfile, 0, SEEK_SET) == !0)
     { cout << "seek errors"; exit(-1); }
   else
     {
      setmode(fileno(buildfile),O_BINARY); // het zijn binaire files
      if (fread(build.blok, sizeof(bouwsteen), soorten, buildfile) != soorten)
        { cout << "end of file detected"; exit(-1); }
     }
   fclose(buildfile);

   if ((mapfile = fopen(mapnaam, "r")) == NULL)
     { cout << "cannot open file"; exit(-1); }
   else if (fseek(mapfile, 0, SEEK_SET) == !0)
     { cout << "seek errors"; exit(-1); }
   else
     {
      setmode(fileno(mapfile),O_BINARY); // het zijn binaire files
      if (fread(mapdata, sizeof(mappiece), maplengte*maphoogte, mapfile) != maplengte*maphoogte)
        { cout << "end of file detected"; exit(-1); }
     }
   fclose(mapfile);

   basismapcoor.Sx     = ship.getshipcoor().Sx - Xscreenmidcoor;
   basismapcoor.Sy     = ship.getshipcoor().Sy - Yscreenmidcoor;
   basismapposition.Sx = basismapcoor.Sx * bloklengte;
   basismapposition.Sy = basismapcoor.Sy * blokhoogte;

   shiftscreen.ScrX = off;
   shiftscreen.ScrY = off;

   reactorstatus.damage = 0;
   reactorstatus.blowtime = 0;
   drawonetime = true;
  }


void Mapdata::updatemap()
  {
   static char counter; // om de snelheid te beperken

   if ((counter++ & animateslowdown) == 0)
     updatemapblocks();
   updatescreenshift();

   basismapcoor.Sx = basismapposition.Sx / bloklengte;
   basismapcoor.Sy = basismapposition.Sy / blokhoogte;
   poscoormod.Sx   = basismapposition.Sx % bloklengte;
   poscoormod.Sy   = basismapposition.Sy % blokhoogte;
                                                         // om de telling te completeren, anders springt het scherm bij nul
   if ((poscoormod.Sx != 0) && (basismapposition.Sx < 0)) basismapcoor.Sx--;
   if (poscoormod.Sx < 0) poscoormod.Sx += bloklengte;   // negatieve modulus voorkomen
  }


void Mapdata::updatebackground()
  {
   if ((shiftscreen.ScrX == off) && (shiftscreen.ScrY == off) && (drawonetime == false))
     drawbackground();
   else
     {
      drawshiftbackground();
      drawonetime = false;
     }
  }


shieldcapture Mapdata::checkshieldcapture()
  {
   shieldcapture shieldcontents = nop;
   checkcoor = ship.getshipcoor();
   // ship naar boven gericht
   if ((ship.getanglenr() > (7 * aantalangles / 8)) ||
       (ship.getanglenr() < (    aantalangles / 8)))
     {
      checkcoor.Sy++;
      char mapsoort = mapdata[checkcoor.Sx][checkcoor.Sy].soort;
      if      (mapsoort == fueltankfull)
        {
         shieldcontents = fueltankcapt;
         if (mapdata[checkcoor.Sx][checkcoor.Sy].Xextra-- == 0)
           {
            mapdata[checkcoor.Sx][checkcoor.Sy].soort++;
            setupdaterequest(checkcoor);
           }
        }
      else if (mapsoort == energypodfull)
        {
         shieldcontents = energypodcapt;
         if (mapdata[checkcoor.Sx][checkcoor.Sy].Xextra-- == 0)
           {
            mapdata[checkcoor.Sx][checkcoor.Sy].soort++;
            setupdaterequest(checkcoor);
           }
        }
      else if (mapsoort == mapballbegin)
        shieldcontents = checkballreach();
      else
        {
         mapsoort = mapdata[checkcoor.Sx][++checkcoor.Sy].soort;
         if (mapsoort == mapballbegin)
           shieldcontents = checkballreach();
        }
     }
   // ship naar rechts gericht
   else if (ship.getanglenr() > (5 * aantalangles / 8))
     {
      checkcoor.Sx++;
      char mapsoort = mapdata[checkcoor.Sx][checkcoor.Sy].soort;
      if      (mapsoort == mapballbegin+3)
        shieldcontents = checkballreach();
      else
        {
         mapsoort = mapdata[++checkcoor.Sx][checkcoor.Sy].soort;
         if (mapsoort == mapballbegin+1)
           shieldcontents = checkballreach();
        }
     }
   // ship naar beneden gericht
   else if (ship.getanglenr() > (3 * aantalangles / 8))
     {
      checkcoor.Sy--;
      char mapsoort = mapdata[checkcoor.Sx][checkcoor.Sy].soort;
      if (mapsoort == mapballbegin+2)
        shieldcontents = checkballreach();
      else
        {
         mapsoort = mapdata[checkcoor.Sx][--checkcoor.Sy].soort;
         if (mapsoort == mapballbegin+2)
           shieldcontents = checkballreach();
        }
     }
   else
   // ship naar rechts gericht
     {
      checkcoor.Sx--;
      char mapsoort = mapdata[checkcoor.Sx][checkcoor.Sy].soort;
      if (mapsoort == mapballbegin+3)
        shieldcontents = checkballreach();
      else
        {
         mapsoort = mapdata[--checkcoor.Sx][checkcoor.Sy].soort;
         if (mapsoort == mapballbegin+1)
           shieldcontents = checkballreach();
        }
     }

   return(shieldcontents);
  }

kogelhit Mapdata::checkshipkogelposition(vector checkposition)
  {
   kogelhit thehit = target;
   intvec checkcoor = {checkposition.X / bloklengte, (checkposition.Y) / blokhoogte};

   backgroundupdaterequest(checkposition);

   char mapsoort = mapdata[checkcoor.Sx][checkcoor.Sy].soort;
   if     (((mapsoort >= holderbegin)      && (mapsoort <turretendright) &&
            (mapsoort != turretenddown) && (mapsoort != turretendleft) && (mapsoort != turretendup)) ||
            (mapsoort == cityend-1)     ||    (mapsoort == cityend) ||
           ((mapsoort >= buttoninbegin)    && (mapsoort <= buttoninend)))
     thehit = shield;
   else if ((mapsoort >= mapballbegin)   && (mapsoort <= mapballend))
     mapdata[checkcoor.Sx][checkcoor.Sy].damage += mapballdamage;
   else if  ((mapsoort == turretenddown)  || (mapsoort == turretendleft) ||
             (mapsoort == turretendup)    || (mapsoort == turretendright))
     mapdata[checkcoor.Sx][checkcoor.Sy].damage += turretdamage;
   else if  ((mapsoort >= turret2begin)   && (mapsoort <= turret2end))
     mapdata[checkcoor.Sx][checkcoor.Sy].damage += turret2damage;
   else if  ((mapsoort >= fueltankfull)   && (mapsoort <= fueltankempty))
     mapdata[checkcoor.Sx][checkcoor.Sy].damage += fueltankdamage;
   else if  ((mapsoort >= energypodfull)   && (mapsoort <= energypodempty))
     mapdata[checkcoor.Sx][checkcoor.Sy].damage += energypoddamage;
   else if (mapsoort == citybegin)
     {
      mapdata[checkcoor.Sx  ][checkcoor.Sy].damage+= citydamage;
      mapdata[checkcoor.Sx+1][checkcoor.Sy].damage = mapdata[checkcoor.Sx  ][checkcoor.Sy].damage += citydamage;
      mapdata[checkcoor.Sx  ][checkcoor.Sy].Xextra = cityshieldtime;
      mapdata[checkcoor.Sx  ][checkcoor.Sy].soort += cityend - citybegin -1;
      mapdata[checkcoor.Sx+1][checkcoor.Sy].soort += cityend - citybegin -1;
      checkcoor.Sx++;
      setlongupdaterequest(checkcoor); // omdat backgroundupdaterequest niet uitgaat van 2 blokken
     }
   else if (mapsoort == citybegin+1)
     {
      mapdata[checkcoor.Sx-1][checkcoor.Sy].damage+= citydamage;
      mapdata[checkcoor.Sx-1][checkcoor.Sy].damage = mapdata[checkcoor.Sx  ][checkcoor.Sy].damage += citydamage;
      mapdata[checkcoor.Sx-1][checkcoor.Sy].Xextra = cityshieldtime;
      mapdata[checkcoor.Sx  ][checkcoor.Sy].soort += cityend - citybegin -1;
      mapdata[checkcoor.Sx-1][checkcoor.Sy].soort += cityend - citybegin -1;
      checkcoor.Sy--;
      setlongupdaterequest(checkcoor); // omdat backgroundupdaterequest niet uitgaat van 2 blokken
     }
   else if ((mapsoort >= buttonoutbegin) && (mapsoort <= buttonoutend))
     {
      mapdata[checkcoor.Sx  ][checkcoor.Sy].soort += buttoninbegin - buttonoutbegin;
      mapdata[checkcoor.Sx  ][checkcoor.Sy].Zextra = buttonintime;
      openlaser(checkcoor);
     }
   else if ((mapsoort >= reactorbegin) && (mapsoort <= reactorend))
     {
      reactorstatus.damage += reactordamage;
      if (mapsoort != reactorend)
         mapdata[checkcoor.Sx][checkcoor.Sy].soort = reactorend;
     }
   return(thehit);
  }

vector Mapdata::getmapballposition()
  {
   vector calcmapballpos;

   mapdata[checkcoor.Sx][checkcoor.Sy].soort +=4;
   setupdaterequest(checkcoor);

   calcmapballpos.X = checkcoor.Sx * bloklengte + (bloklengte /2);
   calcmapballpos.Y = checkcoor.Sy * blokhoogte + (blokhoogte /2);

   return(calcmapballpos);
  }
