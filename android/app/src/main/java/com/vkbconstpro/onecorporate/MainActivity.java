package com.vkbconstpro.onecorporate;

import android.Manifest;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.content.ContentValues;
import android.media.MediaScannerConnection;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private ValueCallback<Uri[]> filePathCallback;
    private static final int FILE_CHOOSER_REQUEST_CODE = 1000;
    private static final int PERMISSION_REQUEST_CODE = 2000;

    private String cameraPhotoPath;
    private Uri cameraPhotoUri;
    private android.webkit.PermissionRequest pendingWebPermissionRequest;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        setContentView(webView);

        requestPermissionsIfNeeded();
        setupWebView();

        webView.loadUrl("file:///android_asset/www/index.html");
    }

    public class WebAppInterface {
        Context mContext;

        WebAppInterface(Context c) {
            mContext = c;
        }

        @JavascriptInterface
        public void printPage(final String documentTitle) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        PrintManager printManager = (PrintManager) getSystemService(Context.PRINT_SERVICE);
                        if (printManager != null && webView != null) {
                            String jobName = (documentTitle != null && !documentTitle.trim().isEmpty())
                                ? documentTitle.trim()
                                : "OneCorporate_Document";
                            PrintDocumentAdapter printAdapter;
                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                                printAdapter = webView.createPrintDocumentAdapter(jobName);
                            } else {
                                printAdapter = webView.createPrintDocumentAdapter();
                            }
                            printManager.print(jobName, printAdapter, new PrintAttributes.Builder().build());
                        }
                    } catch (Exception e) {
                        Toast.makeText(MainActivity.this, "Printing error: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                    }
                }
            });
        }

        @JavascriptInterface
        public boolean saveImageToGallery(final String base64Data, final String fileNamePrefix) {
            try {
                if (base64Data == null || base64Data.trim().isEmpty()) return false;
                String pureBase64 = base64Data.trim();
                if (pureBase64.contains(",")) {
                    pureBase64 = pureBase64.substring(pureBase64.indexOf(",") + 1);
                }
                final byte[] decodedBytes = Base64.decode(pureBase64, Base64.DEFAULT);
                if (decodedBytes == null || decodedBytes.length == 0) return false;

                String prefix = (fileNamePrefix != null && !fileNamePrefix.trim().isEmpty()) ? fileNamePrefix.trim() : "OneCorp_Report";
                String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(new Date());
                final String fileName = prefix + "_" + timeStamp + ".jpg";

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    ContentValues values = new ContentValues();
                    values.put(MediaStore.Images.Media.DISPLAY_NAME, fileName);
                    values.put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg");
                    values.put(MediaStore.Images.Media.RELATIVE_PATH, Environment.DIRECTORY_DCIM + "/Camera");
                    values.put(MediaStore.Images.Media.IS_PENDING, 1);

                    Uri uri = getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
                    if (uri != null) {
                        try (OutputStream out = getContentResolver().openOutputStream(uri)) {
                            if (out != null) {
                                out.write(decodedBytes);
                                out.flush();
                            }
                        }
                        values.clear();
                        values.put(MediaStore.Images.Media.IS_PENDING, 0);
                        getContentResolver().update(uri, values, null, null);

                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                Toast.makeText(MainActivity.this, "📸 Photo saved to Gallery & attached to report", Toast.LENGTH_SHORT).show();
                            }
                        });
                        return true;
                    }
                } else {
                    File dcim = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DCIM);
                    File cameraDir = new File(dcim, "Camera");
                    if (!cameraDir.exists()) cameraDir.mkdirs();
                    final File dest = new File(cameraDir, fileName);
                    try (FileOutputStream fos = new FileOutputStream(dest)) {
                        fos.write(decodedBytes);
                        fos.flush();
                    }
                    MediaScannerConnection.scanFile(MainActivity.this, new String[]{dest.getAbsolutePath()}, new String[]{"image/jpeg"}, null);
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(MainActivity.this, "📸 Photo saved to Gallery & attached to report", Toast.LENGTH_SHORT).show();
                        }
                    });
                    return true;
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            return false;
        }
    }

    private File createImageFile() throws IOException {
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(new Date());
        String imageFileName = "JPEG_" + timeStamp + "_";
        File storageDir = getExternalFilesDir(Environment.DIRECTORY_PICTURES);
        if (storageDir == null) {
            storageDir = getCacheDir();
        }
        File image = File.createTempFile(imageFileName, ".jpg", storageDir);
        cameraPhotoPath = image.getAbsolutePath();
        return image;
    }

    private void setupWebView() {
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setAllowFileAccessFromFileURLs(true);
        webSettings.setAllowUniversalAccessFromFileURLs(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setMediaPlaybackRequiresUserGesture(false);
        webSettings.setUseWideViewPort(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setBuiltInZoomControls(false);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }

        // Add native Android interface for printing / save to PDF
        webView.addJavascriptInterface(new WebAppInterface(this), "AndroidNative");

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.startsWith("file://") || url.startsWith("data:") || url.startsWith("blob:") || url.startsWith("about:")) {
                    return false;
                }
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                } catch (Exception e) {}
                return true;
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, android.webkit.WebResourceRequest request) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    String url = request.getUrl().toString();
                    if (url.startsWith("file://") || url.startsWith("data:") || url.startsWith("blob:") || url.startsWith("about:")) {
                        return false;
                    }
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, request.getUrl());
                        startActivity(intent);
                    } catch (Exception e) {}
                    return true;
                }
                return false;
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(final android.webkit.PermissionRequest request) {
                MainActivity.this.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                            if (ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
                                request.grant(request.getResources());
                            } else {
                                pendingWebPermissionRequest = request;
                                ActivityCompat.requestPermissions(MainActivity.this, new String[]{Manifest.permission.CAMERA}, PERMISSION_REQUEST_CODE);
                            }
                        }
                    }
                });
            }

            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
                if (MainActivity.this.filePathCallback != null) {
                    MainActivity.this.filePathCallback.onReceiveValue(null);
                }
                MainActivity.this.filePathCallback = filePathCallback;

                Intent takePictureIntent = null;
                cameraPhotoUri = null;
                cameraPhotoPath = null;

                if (ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
                    takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                    if (takePictureIntent.resolveActivity(getPackageManager()) != null) {
                        File photoFile = null;
                        try {
                            photoFile = createImageFile();
                        } catch (IOException ex) {}
                        if (photoFile != null) {
                            try {
                                cameraPhotoUri = FileProvider.getUriForFile(MainActivity.this,
                                        getPackageName() + ".fileprovider", photoFile);
                                takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, cameraPhotoUri);
                                takePictureIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
                            } catch (Exception e) {
                                takePictureIntent = null;
                            }
                        }
                    }
                }

                Intent contentSelectionIntent = fileChooserParams.createIntent();
                Intent[] intentArray;
                if (takePictureIntent != null) {
                    intentArray = new Intent[]{takePictureIntent};
                } else {
                    intentArray = new Intent[0];
                }

                Intent chooserIntent = new Intent(Intent.ACTION_CHOOSER);
                chooserIntent.putExtra(Intent.EXTRA_INTENT, contentSelectionIntent);
                chooserIntent.putExtra(Intent.EXTRA_TITLE, "Select File or Take Photo");
                chooserIntent.putExtra(Intent.EXTRA_INITIAL_INTENTS, intentArray);

                try {
                    startActivityForResult(chooserIntent, FILE_CHOOSER_REQUEST_CODE);
                } catch (ActivityNotFoundException e) {
                    MainActivity.this.filePathCallback = null;
                    Toast.makeText(MainActivity.this, "Cannot open file chooser", Toast.LENGTH_LONG).show();
                    return false;
                }
                return true;
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == FILE_CHOOSER_REQUEST_CODE) {
            if (filePathCallback == null) return;
            Uri[] results = null;
            if (resultCode == RESULT_OK) {
                if (data != null && (data.getData() != null || data.getClipData() != null)) {
                    String dataString = data.getDataString();
                    if (dataString != null) {
                        results = new Uri[]{Uri.parse(dataString)};
                    } else if (data.getClipData() != null) {
                        int count = data.getClipData().getItemCount();
                        results = new Uri[count];
                        for (int i = 0; i < count; i++) {
                            results[i] = data.getClipData().getItemAt(i).getUri();
                        }
                    }
                } else if (cameraPhotoUri != null) {
                    File photoFile = cameraPhotoPath != null ? new File(cameraPhotoPath) : null;
                    if (photoFile != null && photoFile.exists() && photoFile.length() > 0) {
                        saveFileToDefaultMediaStore(photoFile);
                        results = new Uri[]{cameraPhotoUri};
                    }
                }
            }
            filePathCallback.onReceiveValue(results);
            filePathCallback = null;
        } else {
            super.onActivityResult(requestCode, resultCode, data);
        }
    }

    private void saveFileToDefaultMediaStore(File sourceFile) {
        if (sourceFile == null || !sourceFile.exists()) return;
        try {
            String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(new Date());
            String fileName = "OneCorp_Camera_" + timeStamp + ".jpg";

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                ContentValues values = new ContentValues();
                values.put(MediaStore.Images.Media.DISPLAY_NAME, fileName);
                values.put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg");
                values.put(MediaStore.Images.Media.RELATIVE_PATH, Environment.DIRECTORY_DCIM + "/Camera");
                values.put(MediaStore.Images.Media.IS_PENDING, 1);

                Uri uri = getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
                if (uri != null) {
                    try (InputStream in = new FileInputStream(sourceFile);
                         OutputStream out = getContentResolver().openOutputStream(uri)) {
                        if (out != null) {
                            byte[] buffer = new byte[8192];
                            int len;
                            while ((len = in.read(buffer)) != -1) {
                                out.write(buffer, 0, len);
                            }
                            out.flush();
                        }
                    }
                    values.clear();
                    values.put(MediaStore.Images.Media.IS_PENDING, 0);
                    getContentResolver().update(uri, values, null, null);
                    Toast.makeText(this, "📸 Photo saved to Gallery & attached to report", Toast.LENGTH_SHORT).show();
                }
            } else {
                File dcim = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DCIM);
                File cameraDir = new File(dcim, "Camera");
                if (!cameraDir.exists()) cameraDir.mkdirs();
                File dest = new File(cameraDir, fileName);
                try (InputStream in = new FileInputStream(sourceFile);
                     OutputStream out = new FileOutputStream(dest)) {
                    byte[] buffer = new byte[8192];
                    int len;
                    while ((len = in.read(buffer)) != -1) {
                        out.write(buffer, 0, len);
                    }
                    out.flush();
                }
                MediaScannerConnection.scanFile(this, new String[]{dest.getAbsolutePath()}, new String[]{"image/jpeg"}, null);
                Toast.makeText(this, "📸 Photo saved to Gallery & attached to report", Toast.LENGTH_SHORT).show();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void requestPermissionsIfNeeded() {
        List<String> permissions = new ArrayList<>();
        permissions.add(Manifest.permission.CAMERA);
        if (Build.VERSION.SDK_INT >= 33) {
            permissions.add(Manifest.permission.READ_MEDIA_IMAGES);
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            permissions.add(Manifest.permission.READ_EXTERNAL_STORAGE);
            if (Build.VERSION.SDK_INT <= 28) {
                permissions.add(Manifest.permission.WRITE_EXTERNAL_STORAGE);
            }
        }

        List<String> needed = new ArrayList<>();
        for (String perm : permissions) {
            if (ContextCompat.checkSelfPermission(this, perm) != PackageManager.PERMISSION_GRANTED) {
                needed.add(perm);
            }
        }
        if (!needed.isEmpty()) {
            ActivityCompat.requestPermissions(this, needed.toArray(new String[0]), PERMISSION_REQUEST_CODE);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == PERMISSION_REQUEST_CODE) {
            if (pendingWebPermissionRequest != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
                    pendingWebPermissionRequest.grant(pendingWebPermissionRequest.getResources());
                } else {
                    pendingWebPermissionRequest.deny();
                }
                pendingWebPermissionRequest = null;
            }
        }
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
