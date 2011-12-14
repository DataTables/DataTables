#!/bin/sh

# DEFAULTS
CLOSURE="/usr/local/closure_compiler/compiler.jar"
JSDOC="/usr/local/jsdoc/jsdoc"
CMD=$1

MAIN_FILE="../js/jquery.dataTables.js"
MIN_FILE="../js/jquery.dataTables.min.js"


cd ../media/src

echo ""
echo "  DataTables build ($(grep " * Version:     " DataTables.js | awk -F" " '{ print $3 }'))"
echo ""


IFS='%'

cp DataTables.js DataTables.js.build

echo "  Building main script"
grep "require(" DataTables.js.build > /dev/null
while [ $? -eq 0 ]; do
	REQUIRE=$(grep "require(" DataTables.js.build | head -n 1)

	SPACER=$(echo ${REQUIRE} | cut -d r -f 1)
	FILE=$(echo ${REQUIRE} | sed -e "s#^.*require('##g" -e "s#');##")
	DIR=$(echo ${FILE} | cut -d \. -f 1)

	sed "s#^#${SPACER}#" < ${DIR}/${FILE} > ${DIR}/${FILE}.build

	sed -e "/${REQUIRE}/r ${DIR}/${FILE}.build" -e "/${REQUIRE}/d" < DataTables.js.build > DataTables.js.out
	mv DataTables.js.out DataTables.js.build

	rm ${DIR}/${FILE}.build

	grep "require(" DataTables.js.build > /dev/null
done

mv DataTables.js.build $MAIN_FILE


if [ "$CMD" != "debug" ]; then
	if [ "$CMD" = "docs" -o "$CMD" = "" ]; then
		echo "  JSHint"
		jshint $MAIN_FILE --config ../../scripts/jshint.config
		if [ $? -ne 0 ]; then
			echo "    Errors occured - exiting"
			exit 1
		else
			echo "    Pass" 
		fi
	fi

	if [ "$CMD" = "compress" -o "$CMD" = "" ]; then
		echo "  Minification"
		java -jar $CLOSURE --js $MAIN_FILE > $MIN_FILE
		echo "    Min JS file size: $(ls -l $MIN_FILE | awk -F" " '{ print $5 }')"
	fi

	if [ "$CMD" = "docs" -o "$CMD" = "" ]; then
		echo "  Documentation"
		$JSDOC -d ../../docs -t JSDoc-DataTables $MAIN_FILE
	fi
fi

echo "  Done\n"


