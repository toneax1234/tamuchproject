#!/bin/bash

echo 'printing keystore for Org1'

ORG_1_KEYSTORE=$(ls ../crypto-config/peerOrganizations/org1/users/Admin\@org1/msp/keystore/)
ORG_2_KEYSTORE=$(ls ../crypto-config/peerOrganizations/org2/users/Admin\@org2/msp/keystore/)
ORG_3_KEYSTORE=$(ls ../crypto-config/peerOrganizations/org3/users/Admin\@org3/msp/keystore/)

ORG_1_PATH_TO_KEYSTORE="Admin@org1/msp/keystore/"
ORG_2_PATH_TO_KEYSTORE="Admin@org2/msp/keystore/"
ORG_3_PATH_TO_KEYSTORE="Admin@org3/msp/keystore/"

UPDATED_KEYSTORE_ORG_1="$ORG_1_PATH_TO_KEYSTORE$ORG_1_KEYSTORE"
UPDATED_KEYSTORE_ORG_2="$ORG_2_PATH_TO_KEYSTORE$ORG_2_KEYSTORE"
UPDATED_KEYSTORE_ORG_3="$ORG_3_PATH_TO_KEYSTORE$ORG_3_KEYSTORE"

echo $UPDATED_KEYSTORE_ORG_1

# sed -i "s|keystore/.*|${UPDATED_KEYSTORE}|g" connection.yaml
# .* is regex-ese for "any character followed by zero or more of any character(s)"

echo 'updating connection.yaml Org1 adminPrivateKey path with' ${UPDATED_KEYSTORE_ORG_1}

sed -i -e "s|Admin@org1/msp/keystore/.*|$UPDATED_KEYSTORE_ORG_1|g" connection.yaml

echo 'updating connection.yaml Org2 adminPrivateKey path with' ${UPDATED_KEYSTORE_ORG_2}

sed -i -e "s|Admin@org2/msp/keystore/.*|$UPDATED_KEYSTORE_ORG_2|g" connection.yaml

echo 'updating connection.yaml Org3 adminPrivateKey path with' ${UPDATED_KEYSTORE_ORG_3}

sed -i -e "s|Admin@org3/msp/keystore/.*|$UPDATED_KEYSTORE_ORG_3|g" connection.yaml