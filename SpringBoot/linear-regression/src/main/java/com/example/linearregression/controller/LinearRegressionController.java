package com.example.linearregression.controller;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.example.linearregression.helper.CreateProject;
import com.example.linearregression.model.Chat;
import com.example.linearregression.model.ChatHelper;
import com.example.linearregression.model.FileHelper;
import com.example.linearregression.model.FilesDTO;
import com.example.linearregression.model.HelperData;
import com.example.linearregression.model.MessagesDTO;
import com.example.linearregression.model.ProjectDTO;
import com.example.linearregression.model.UserDTO;
import com.example.linearregression.repository.ChatRepository;
import com.example.linearregression.repository.FilesRepository;
import com.example.linearregression.repository.MessageRepository;
import com.example.linearregression.repository.ProjectsRepository;
import com.example.linearregression.repository.UserRepository;
import com.example.linearregression.service.AwsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;

import jakarta.servlet.http.HttpServletRequest;
import lombok.experimental.Helper;

@RestController
@RequestMapping("/")
@CrossOrigin("http://localhost:5173")
@Controller
public class LinearRegressionController {

   
    @Autowired
    private UserRepository userRepo;

    @Autowired
    private FilesRepository filesRepo;

    @Autowired
    private ProjectsRepository projectRepo;

    @Autowired 
    private AwsService awsService;

    @Autowired 
    private MessageRepository messageRepo;

    @Autowired
    private ChatRepository chatRepo;

    @GetMapping("/testing")
    public ResponseEntity<String> getTesting() {
        return ResponseEntity.ok("Wokring");
    }


  
    // @GetMapping("/users")
    // public ResponseEntity<?> getAllUsers(@Param("name") String name) {
        
    //     return ResponseEntity.ok(userRepo.findAll());
    // }

    @GetMapping("/users")
    public List<UserDTO> getMethodUsers() {
        return userRepo.findAll();
    }

    @GetMapping("/users/message")
    public List<UserDTO> getMethodUsersMessage(HttpServletRequest request) {

        List<UserDTO> users = userRepo.findAll();
        for (UserDTO userDTO : users) {

            Principal principal = request.getUserPrincipal();
            String a = principal.getName().toString(); 
            
            String b = userDTO.getEmail();
            String c = "";


            if(a.compareTo(b) == 0){
                c = a + b;
            }
    
            if(a.compareTo(b) < 0){
                c = b + a;
            }
    
            if(a.compareTo(b) > 0){
                c = a + b;
            }
    
         
    
            Optional<Chat> room = chatRepo.findByRoom(c);
            if(room.isPresent()){
                
                List<MessagesDTO> message = messageRepo.findByChatRoomId(room.get().getRoomId());

                userDTO.setLastMessage(message.get(message.size()-1).getMessage() + " at " + message.get(message.size()-1).getDate());
                System.out.println("----------------good of the group " + message.get(message.size()-1).getMessage());
                if(message.get(message.size()-1).getSeen() == null){
                    System.out.println("----------------good Wow ");
                    userDTO.setSeenMesssage(false);
                }
                if(message.get(message.size()-1).getSeen() != null){
                    System.out.println("----------------good No ");
                    userDTO.setSeenMesssage(message.get(message.size()-1).getSeen());
                }
                
                
            }else{
                userDTO.setLastMessage("Say Hey");
                System.out.println("----------------good of the group " );
                
            }
        }
        return users;

        
    }

    @GetMapping("/user/email")
    public String getUserEmail(HttpServletRequest request) {
        Principal principal = request.getUserPrincipal();
        return  principal.getName().toString();
    }

    @GetMapping("/current/user")
    public UserDTO getCurrentUser(HttpServletRequest request) {
        Principal principal = request.getUserPrincipal();
        
        Optional<UserDTO> user =  userRepo.findByEmail(principal.getName().toString());
        System.out.println("--------------- x4444 " + user.get().getId());
        return user.get();
    }

    @PostMapping("/upload/photo/aws")
    public String uploadPhotoToAWS(HttpServletRequest request, @RequestParam("photo") MultipartFile file) throws Exception {
        Principal principal = request.getUserPrincipal();
            Optional<UserDTO> user =  userRepo.findByEmail(principal.getName().toString());


        return awsService.uploadPhoto(principal.getName().toString(), file);
    }

    @PostMapping("/download/photo")
    public ResponseEntity<ByteArrayResource> downloadPhoto(HttpServletRequest request) {

        Principal principal = request.getUserPrincipal();
        Optional<UserDTO> user =  userRepo.findByEmail(principal.getName().toString());

        byte[] data = awsService.downloadFile(user.get().getPhotoId());
        ByteArrayResource resource = new ByteArrayResource(data);

        return ResponseEntity
                .ok()
                .header("Content-type", "application/octet-stream")
                .header("Content-disposition", "attachment; filename=\"" + "\"")
                .body(resource);
    }

    @PostMapping("/download/photo/user")
    public ResponseEntity<ByteArrayResource> downloadPhotoUser(HttpServletRequest request, @RequestBody UserDTO user) {

        
        byte[] data = awsService.downloadFile(user.getPhotoId());
        ByteArrayResource resource = new ByteArrayResource(data);

        return ResponseEntity
                .ok()
                .header("Content-type", "application/octet-stream")
                .header("Content-disposition", "attachment; filename=\"" + "\"")
                .body(resource);
    }

    @PostMapping("/chat/history")
    public List<MessagesDTO> getChatHistory(HttpServletRequest request, @RequestBody ChatHelper chatHelper) {

        String a = chatHelper.getEmail();
        String b = chatHelper.getEmail2();
        String c = "";

        Principal principal = request.getUserPrincipal();
        System.out.println(principal.toString());
        System.out.println("--------------- x5555 " + chatHelper.getEmail() + chatHelper.getEmail2());
        if(a.equals(principal.getName().toString())){

            //      An int value: 0 if the string is equal to the other string.
            //      < 0 if the string is lexicographically less than the other string
            //      > 0 if the string is lexicographically greater than the other string (more characters)

        
            if(a.compareTo(b) == 0){
                c = a + b;
            }

            if(a.compareTo(b) < 0){
                c = b + a;
            }

            if(a.compareTo(b) > 0){
                c = a + b;
            }

            System.out.println("-----------x " + c);
            Optional<Chat> room = chatRepo.findByRoom(c);

            
            

            if(room.isPresent()){
                List<MessagesDTO> messages = messageRepo.findByChatRoomId(room.get().getRoomId());

                for (MessagesDTO messagesDTO : messages) {
                    System.out.println("-------------x C ");
                    messagesDTO.setSeen(true);
                    messageRepo.save(messagesDTO);
                }
                System.out.println("-----------x ahsdfhabsdh");
                return messages;
            
            }
        }

        

        return null;


        
    }
    
    @PostMapping("/chat/seen")
    public List<MessagesDTO> getChatSeen(HttpServletRequest request, @RequestBody ChatHelper chatHelper) {

            System.out.println("-------------x b " + chatHelper.getRoomId());
            List<MessagesDTO> messages = messageRepo.findByChatRoomId(chatHelper.getRoomId());

            for (MessagesDTO messagesDTO : messages) {
                System.out.println("-------------x C ");
                messagesDTO.setSeen(true);
                messageRepo.save(messagesDTO);
            }


        return messages;


        
    }
    


    @GetMapping("/files")
    public ResponseEntity<?> getAllFiles() {
        
        return ResponseEntity.ok(filesRepo.findAll());
    }



    @RequestMapping(value = "/username", method = RequestMethod.GET)
    public String currentUserName(HttpServletRequest request) {
        Principal principal = request.getUserPrincipal();

        return principal.getName().toString();
    }


    @GetMapping("/demo")
    public ResponseEntity<String> getDemo() {
       
        // notes https://www.baeldung.com/java-9-http-client 
        
        // first we are creating a request using HttpRequest 
        HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create("http://127.0.0.1:5000/"))
        .version(HttpClient.Version.HTTP_2)
        .GET()
        .build();


        HttpResponse<String> response = null;
        // 
		try {
            
			response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
            System.out.println("--------------xnice");
		} catch (IOException e) {
			e.printStackTrace();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

        return ResponseEntity.ok(response.body());

    }


    @GetMapping("/json")
    public ResponseEntity<?> getJsonDemo() {
       
        // notes https://www.baeldung.com/java-9-http-client 
        
        // first we are creating a request using HttpRequest 
        HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create("http://127.0.0.1:5000/test"))
        .version(HttpClient.Version.HTTP_2)
        .GET()
        .build();

        
        HttpResponse<String> response = null;

		try {
            
			response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

		} catch (IOException e) {
			e.printStackTrace();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

        System.out.println(response);
        return ResponseEntity.ok(response.body());
    }

   

   
    @GetMapping(path = "/json2", produces = "image/png")
    public ResponseEntity<?>  getJsonDemo2() {
    
        // notes https://www.baeldung.com/java-9-http-client 
        
        // first we are creating a request using HttpRequest 
        HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create("http://127.0.0.1:5000/plot"))
        .version(HttpClient.Version.HTTP_2)
        .GET()
        .build();

        
        // okay to gather the image from the flask 
        // we need to create this vairble for the response 
        HttpResponse<byte[]> response = null;
    

        // next we need to make a try and catch block 
        try {
            
            // here we will try to gather the request but make sure to use ofByteArray 
            response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofByteArray());
            

        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        //System.out.println(response.body());
        // byte[] image = response.body().getBytes();

        // we just return the response 
        return ResponseEntity.ok(response.body());
    }


    @GetMapping(path = "/linear/test", produces = "image/png")
    public ResponseEntity<?>  getLinearTest() {
    
        // notes https://www.baeldung.com/java-9-http-client 
        
        // first we are creating a request using HttpRequest 
        HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create("http://127.0.0.1:5000/linear/model/test"))
        .version(HttpClient.Version.HTTP_2)
        .GET()
        .build();

        
        // okay to gather the image from the flask 
        // we need to create this vairble for the response 
        HttpResponse<byte[]> response = null;
    

        // next we need to make a try and catch block 
        try {
            
            // here we will try to gather the request but make sure to use ofByteArray 
            response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofByteArray());
            

        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        //System.out.println(response.body());
        // byte[] image = response.body().getBytes();

        // we just return the response 
        return ResponseEntity.ok(response.body());
    }


    // @CrossOrigin
    // @RequestMapping("/UploadFile")
    // @ResponseBody
    // public void uploadFile(@RequestParam("file") MultipartFile file, method = RequestMethod.POST, consumes = "multipart/form-data") {

    // }

    @PostMapping("/upload")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file, HttpServletRequest request2) throws Exception {



        try {

            // Get the file and save it somewhere
            byte[] bytes = file.getBytes();
            Path path = Paths.get("./linear-regression/src/main/res/" + file.getOriginalFilename());
            Files.write(path, bytes);

        
        } catch (IOException e) {
            e.printStackTrace();
        }

        // so this grabs anything from our principals 
        Principal principal = request2.getUserPrincipal();

        
        
        System.out.println("---------- time " + principal.getName().toString());

        HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create("http://127.0.0.1:5000/upload"))
        .POST(BodyPublishers.ofByteArray(file.getBytes()))
        .header("file", "hey")
        .header("file2", "hey222")
        .build();

        
    

        
        HttpResponse<String> response = null;

		try {
            
			response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

		} catch (IOException e) {
			e.printStackTrace();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
        
        return ResponseEntity.ok(response.body());
        
        }


    @PostMapping("/upload/project")
    public ResponseEntity<?> uploadProjectFile(@RequestParam("file") MultipartFile file, @RequestParam("projectId") String projectId, HttpServletRequest request2) throws Exception {



        try {

            // Get the file and save it somewhere
            byte[] bytes = file.getBytes();
            Path path = Paths.get("./linear-regression/src/main/res/" + file.getOriginalFilename());
            Files.write(path, bytes);

        
        } catch (IOException e) {
            e.printStackTrace();
        }

        // so this grabs anything from our principals 
        Principal principal = request2.getUserPrincipal();

        
        
        System.out.println("---------- time " + principal.getName().toString());

        HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create("http://127.0.0.1:5000/upload"))
        .POST(BodyPublishers.ofByteArray(file.getBytes()))
        .header("file", "hey")
        .header("file2", "hey222")
        .build();
    

        
        HttpResponse<String> response = null;

        try {
            
            response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        

        

        Optional<ProjectDTO> projectToUpdate = projectRepo.findById(projectId);
        Optional user =  userRepo.findByEmail(principal.getName().toString());
        if(projectToUpdate.isPresent() && user.isPresent()){

        
            
            projectToUpdate.get().setP(false);
            projectToUpdate.get().setFile(file.getBytes());
            
            projectToUpdate.get().setUser((UserDTO) user.get());

            projectRepo.save(projectToUpdate.get());
            
        }
        System.out.println(" new project ");
        
        return ResponseEntity.ok(response.body());
        
        }

    
    @PostMapping("/create/project")
    public ResponseEntity<?> createProject(HttpServletRequest request2) throws Exception {

        // so this grabs anything from our principals 
        Principal principal = request2.getUserPrincipal();

        ProjectDTO projectToAdd = new ProjectDTO();
        projectToAdd.setP(false);
            
        Optional user =  userRepo.findByEmail(principal.getName().toString());
        if(user.isPresent()){
            projectToAdd.setUser((UserDTO) user.get());
            projectRepo.save(projectToAdd);
        }

        return ResponseEntity.ok(projectToAdd);
        
    }
    
        

    @RequestMapping(path = "/upload/regression", method = RequestMethod.POST, produces = "image/png")
    public ResponseEntity<?> uploadLinearRegression(@RequestParam("file") MultipartFile file, 
        @RequestParam("independent") String independent, 
        @RequestParam("dependent") String dependent) throws Exception {

            // try {

            //     // Get the file and save it somewhere
            //     byte[] bytes = file.getBytes();
            //     Path path = Paths.get("./linear-regression/src/main/res/" + file.getOriginalFilename());
            //     Files.write(path, bytes);

            
            // } catch (IOException e) {
            //     e.printStackTrace();
            // }
            HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("http://127.0.0.1:5000/upload/regression"))
            .POST(BodyPublishers.ofByteArray(file.getBytes()))
            .header("independent", independent)
            .header("dependent", dependent)
            .build();

            HttpRequest request2 = HttpRequest.newBuilder()
            .uri(URI.create("http://127.0.0.1:5000/upload/regression/data"))
            .POST(BodyPublishers.ofByteArray(file.getBytes()))
            .header("independent", independent)
            .header("dependent", dependent)
            .build();
        

            
            HttpResponse<byte[]> response = null;
            HttpResponse<String> response2 = null;

            try {
        
                response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofByteArray());
                System.out.println("---------- time44444");
                System.out.println(response.body());
                //response2 = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
                
                // System.out.println("---------- time5555555");
                // System.out.println(response2.body());
            } catch (IOException e) {
                e.printStackTrace();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            
        
            return ResponseEntity.ok(response.body());
        
        }

       
    @PostMapping("/upload/regression/data")
    public ResponseEntity<?> uploadLinearRegressionData(@RequestParam("file") MultipartFile file, 
        @RequestParam("independent") String independent, 
        @RequestParam("dependent") String dependent) throws Exception {

            System.out.println("FEAR --------------");
            

            HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("http://127.0.0.1:5000/upload/regression/data"))
            .POST(BodyPublishers.ofByteArray(file.getBytes()))
            .header("independent", independent)
            .header("dependent", dependent)
            .build();
        

            
            HttpResponse<String> response = null;

		try {
            
			response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

		} catch (IOException e) {
			e.printStackTrace();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
        
        return ResponseEntity.ok(response.body());
        
        }

    

    @GetMapping("/get/Projects")
    public ResponseEntity<?> getProjects(HttpServletRequest request) {
            System.out.println("----------x ");
            Principal principal = request.getUserPrincipal();
            Optional<UserDTO> user =  userRepo.findByEmail(principal.getName().toString());
            System.out.println("----------x2345 " + principal.getName().toString());

            if(user.isPresent()){
                System.out.println("----------x23 " + principal.getName().toString());

                Optional<ProjectDTO>  projects = projectRepo.findByUser(user.get());
                System.out.println("----------2828282 " + principal.getName().toString());

                return ResponseEntity.ok(projects);
                
            }

            return ResponseEntity.ok("Could not find users or projects");
        }
        





    @RequestMapping(path = "/save/regression", method = RequestMethod.POST, consumes = "multipart/form-data")
    @ResponseBody
    public ResponseEntity<?> saveLinearRegression(@RequestParam("ProjectID") String projectId,  @RequestParam("photos") MultipartFile photos) throws Exception {

            // first we need to save the csv file and the photos to the array 
            
            //byte[] bytescsv = files.getBytes();
            System.out.println("------------x heyeyeyeyeyey");

            ArrayList<byte[]> photosList = new ArrayList<>();

            

            FilesDTO filesToAdd = new FilesDTO();

            //filesToAdd.setCsvFile(bytescsv);
            filesToAdd.setPhotos(photosList);
            filesRepo.save(filesToAdd);
            return ResponseEntity.ok("Saved");
        }




    

    @GetMapping("/columns")
    public ResponseEntity<?> getcolumns() {
       
        // notes https://www.baeldung.com/java-9-http-client 
        
        // first we are creating a request using HttpRequest 
        HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create("http://127.0.0.1:5000/columns"))
        .version(HttpClient.Version.HTTP_2)
        .GET()
        .build();


        

        
        HttpResponse<String> response = null;

		try {
            
			response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

		} catch (IOException e) {
			e.printStackTrace();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}


        

        System.out.println(response);
        return ResponseEntity.ok(response.body());
    }


    @GetMapping("/poly")
    public ResponseEntity<?> getNN() {
       
        // notes https://www.baeldung.com/java-9-http-client 
        
        // first we are creating a request using HttpRequest 
        HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create("http://127.0.0.1:5000/nn"))
        .version(HttpClient.Version.HTTP_2)
        .GET()
        .build();

        HttpResponse<String> response = null;

		try {
            
			response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

		} catch (IOException e) {
			e.printStackTrace();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}


        

        
        return ResponseEntity.ok(response.body());
    }


    @PostMapping("/nn/columns")
    public ResponseEntity<?> nnCols(@RequestParam("file") MultipartFile file, HttpServletRequest request2) throws Exception {



        try {

            // Get the file and save it somewhere
            byte[] bytes = file.getBytes();
            Path path = Paths.get("./linear-regression/src/main/res/" + file.getOriginalFilename());
            Files.write(path, bytes);

        
        } catch (IOException e) {
            e.printStackTrace();
        }

        // so this grabs anything from our principals 
        Principal principal = request2.getUserPrincipal();

        
        
        System.out.println("---------- time " + principal.getName().toString());

        HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create("http://127.0.0.1:5000/nn/columns"))
        .POST(BodyPublishers.ofByteArray(file.getBytes()))
        .header("file", "hey")
        .header("file2", "hey222")
        .build();

        
    

        
        HttpResponse<String> response = null;

		try {
            
			response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

		} catch (IOException e) {
			e.printStackTrace();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
        
        return ResponseEntity.ok(response.body());
        
        }


    @PostMapping("/poly/image")
    public ResponseEntity<?> getNNImage(@RequestParam(value ="independent") String independent) {
       
        // notes https://www.baeldung.com/java-9-http-client 
        
        // first we are creating a request using HttpRequest 
        System.out.println(independent);
        HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create("http://127.0.0.1:5000/nn/image"))
        .header("independent", independent)
        .version(HttpClient.Version.HTTP_2)
        .GET()
        .build();

        HttpResponse<byte[]> response = null;

		try {
            
			response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofByteArray());
		} catch (IOException e) {
			e.printStackTrace();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}


        

        
        return ResponseEntity.ok(response.body());
    }

    @RequestMapping(path = "/run/Network", method = RequestMethod.POST)
    public ResponseEntity<?> runNeuralNetwork(@RequestParam("file") MultipartFile file, 
        @RequestParam("target") String target, 
        @RequestParam("neurons") String neurons,
        @RequestParam("epochs") String epochs) throws Exception {

        HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create("http://127.0.0.1:5000/nn/run"))
        .POST(BodyPublishers.ofByteArray(file.getBytes()))
        .header("target", target)
        .header("neurons", neurons)
        .header("epochs", epochs)
        .build();

        System.out.println("---------- time44444" + target + neurons + epochs);

        HttpResponse<String> response = null;

        try {
    
            response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
            System.out.println("---------- time44444");
            System.out.println(response.body());
            //response2 = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
            
            // System.out.println("---------- time5555555");
            // System.out.println(response2.body());
        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        
    
        return ResponseEntity.ok(response.body());
        
    }


}
