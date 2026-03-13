#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <openssl/evp.h>
#include <openssl/sha.h>

#define SIZE 16
#define MAX 1024

void error() {
    printf("Error occurred\n");
    exit(1);
}

// Generate AES key from password using SHA-256
void getKey(const char *pass, unsigned char *key) {
    SHA256((unsigned char *)pass, strlen(pass), key);
}

// Convert bytes to hex format
void printHex(const unsigned char *data, int len) {
    for (int i = 0; i < len; i++)
        printf("%02x", data[i]);
    printf("\n");
}

void encryptData(const unsigned char *text, int textLen, unsigned char *cipher, int *cipherLen, const unsigned char *key, const unsigned char *iv) {
    printf("\n=== ENCRYPTION START ===\n");
    fflush(stdout);  // Force output

    printf("Plaintext: %s\n", text);
    printf("Plaintext Length: %d\n", textLen);
    fflush(stdout);  // Force output

    printf("Key: ");
    printHex(key, SIZE);
    fflush(stdout);  // Force output

    printf("IV: ");
    printHex(iv, SIZE);
    fflush(stdout);  // Force output

    EVP_CIPHER_CTX *ctx = EVP_CIPHER_CTX_new();
    if (!ctx) error();

    if (EVP_EncryptInit_ex(ctx, EVP_aes_128_cbc(), NULL, key, iv) != 1) error();
    printf("EVP_EncryptInit_ex: Success\n");
    fflush(stdout);  // Force output

    int len;
    if (EVP_EncryptUpdate(ctx, cipher, &len, text, textLen) != 1) error();
    *cipherLen = len;
    printf("EVP_EncryptUpdate: Cipher Length after update: %d\n", *cipherLen);
    fflush(stdout);  // Force output

    if (EVP_EncryptFinal_ex(ctx, cipher + len, &len) != 1) error();
    *cipherLen += len;
    printf("EVP_EncryptFinal_ex: Final Cipher Length: %d\n", *cipherLen);
    fflush(stdout);  // Force output

    printf("Encrypted Data (Hex): ");
    printHex(cipher, *cipherLen);
    fflush(stdout);  // Force output

    EVP_CIPHER_CTX_free(ctx);
    printf("=== ENCRYPTION END ===\n\n");
    fflush(stdout);  // Force output
}

// Decryption function
void decryptData(const unsigned char *cipher, int cipherLen, unsigned char *plain, int *plainLen, const unsigned char *key, const unsigned char *iv) {
    EVP_CIPHER_CTX *ctx = EVP_CIPHER_CTX_new();
    if (!ctx) error();

    if (EVP_DecryptInit_ex(ctx, EVP_aes_128_cbc(), NULL, key, iv) != 1) error();

    int len;
    if (EVP_DecryptUpdate(ctx, plain, &len, cipher, cipherLen) != 1) error();
    *plainLen = len;

    if (EVP_DecryptFinal_ex(ctx, plain + len, &len) != 1) error();
    *plainLen += len;

    plain[*plainLen] = '\0';

    EVP_CIPHER_CTX_free(ctx);
}

int main() {
    unsigned char key[SIZE];
    unsigned char iv[SIZE] = "randomIV12345678";  // 16-byte IV

    char pass[50];
    unsigned char text[MAX], cipher[MAX + SIZE], plain[MAX];
    int choice, cipherLen, plainLen;

    // Ensure cipher1.txt exists as an empty file
    FILE *file = fopen("cipher1.txt", "w");
    if (!file) {
        perror("File creation failed");
        exit(1);
    }
    fclose(file);
    printf("cipher1.txt has been created as an empty file.\n");

    printf("Enter password: ");
    fgets(pass, sizeof(pass), stdin);
    pass[strcspn(pass, "\n")] = '\0';  // Remove newline character

    getKey(pass, key);  // Generate AES key from password

    while (1) {
        printf("\nChoose an option:\n1. Encrypt & Save\n2. Decrypt & Read\n3. Exit\n");
        scanf("%d", &choice);
        getchar(); // Consume newline left by scanf

        if (choice == 3) {
            printf("Exiting\n");
            break;
        }

        if (choice == 1) {
            printf("Enter text to encrypt: ");
            fgets((char *)text, MAX, stdin);
            text[strcspn((char *)text, "\n")] = '\0'; // Remove newline

            // Encrypt data with debug output
            encryptData(text, strlen((char *)text), cipher, &cipherLen, key, iv);

            // Save encrypted data to file
            FILE *file = fopen("cipher.txt", "w");
            if (!file) {
                perror("File error");
                exit(1);
            }
            fwrite(cipher, 1, cipherLen, file);
            fclose(file);

            printf("Encrypted data saved to 'cipher.txt'\n");
        } else if (choice == 2) {
            FILE *file = fopen("cipher.txt", "r");
            if (!file) {
                printf("File not found. Encrypt first.\n");
                continue;
            }
            cipherLen = fread(cipher, 1, sizeof(cipher), file);
            fclose(file);

            printf("\nEncrypted Data Read from File (Hex): ");
            printHex(cipher, cipherLen);

            decryptData(cipher, cipherLen, plain, &plainLen, key, iv);
            printf("Decrypted text: %s\n", plain);
        } else {
            printf("Invalid choice. Enter 1, 2, or 3\n");
        }
    }
    return 0;
}
