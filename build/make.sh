#!/bin/sh

cd ../media/src

cp DataTables.js DataTables.js.build

IFS='%'

grep "require(" DataTables.js.build > /dev/null
while [ $? -eq 0 ]; do
	REQUIRE=$(grep "require(" DataTables.js.build | head -n 1)

	SPACER=$(echo ${REQUIRE} | cut -d r -f 1)
	FILE=$(echo ${REQUIRE} | sed -e "s#^.*require('##g" -e "s#');##")
	DIR=$(echo ${FILE} | cut -d \. -f 1)

	echo "  $FILE"

	sed "s#^#${SPACER}#" < ${DIR}/${FILE} > ${DIR}/${FILE}.build

	sed -e "/${REQUIRE}/r ${DIR}/${FILE}.build" -e "/${REQUIRE}/d" < DataTables.js.build > DataTables.js.out
	mv DataTables.js.out DataTables.js.build

	rm ${DIR}/${FILE}.build

	grep "require(" DataTables.js.build > /dev/null
done

mv DataTables.js.build ../js/jquery.dataTables.js
