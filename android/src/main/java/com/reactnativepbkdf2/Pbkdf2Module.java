package com.reactnativepbkdf2;

import android.util.Base64;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import org.spongycastle.crypto.Digest;
import org.spongycastle.crypto.digests.SHA1Digest;
import org.spongycastle.crypto.digests.SHA256Digest;
import org.spongycastle.crypto.digests.SHA512Digest;
import org.spongycastle.crypto.generators.PKCS5S2ParametersGenerator;
import org.spongycastle.crypto.params.KeyParameter;

@ReactModule(name = Pbkdf2Module.NAME)
public class Pbkdf2Module extends ReactContextBaseJavaModule {
  public static final String NAME = "Pbkdf2";

  public Pbkdf2Module(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void derive(String password, String salt, int iterations, int keySize, String hash, Promise promise) {
    byte[] decodedPassword = android.util.Base64.decode(password, Base64.DEFAULT);
    byte[] decodedSalt = android.util.Base64.decode(salt, Base64.DEFAULT);
    Digest digest = new SHA1Digest();
    if (hash.equals("sha256")) {
      digest = new SHA256Digest();
    } else if (hash.equals("sha512")) {
      digest = new SHA512Digest();
    }
    PKCS5S2ParametersGenerator gen = new PKCS5S2ParametersGenerator(digest);
    gen.init(decodedPassword, decodedSalt, iterations);
    byte[] key = ((KeyParameter) gen.generateDerivedParameters(keySize * 8)).getKey();
    promise.resolve(Base64.encodeToString(key, Base64.DEFAULT));
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public String deriveSync(String password, String salt, int iterations, int keySize, String hash) {
    byte[] decodedPassword = android.util.Base64.decode(password, Base64.DEFAULT);
    byte[] decodedSalt = android.util.Base64.decode(salt, Base64.DEFAULT);
    Digest digest = new SHA1Digest();
    if (hash.equals("sha256")) {
      digest = new SHA256Digest();
    } else if (hash.equals("sha512")) {
      digest = new SHA512Digest();
    }
    PKCS5S2ParametersGenerator gen = new PKCS5S2ParametersGenerator(digest);
    gen.init(decodedPassword, decodedSalt, iterations);
    byte[] key = ((KeyParameter) gen.generateDerivedParameters(keySize * 8)).getKey();
    return Base64.encodeToString(key, Base64.DEFAULT);
  }
}
