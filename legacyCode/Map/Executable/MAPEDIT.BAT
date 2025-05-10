@echo off
mapedit.exe level1.mix level1.new

@echo let op jan-auwke als je de nieuw map wilt saven druk
@echo dan op spatie
@echo wanneer je de nieuwe map wilt weggooien druk dan op CTRL-C

pause
del level1.old
rename level1.mix level1.old
rename level1.new level1.mix
