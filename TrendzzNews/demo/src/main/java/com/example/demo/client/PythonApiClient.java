package com.example.demo.client;
import java.util.List;
import java.util.Map;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.example.demo.dto.ContentResponseDTO;

@Component
public class PythonApiClient {

    private final WebClient pythonWebClient;
 
    public PythonApiClient(WebClient pythonWebClient) {
        this.pythonWebClient = pythonWebClient;
    }


    @Cacheable(value = "generatedContent", key = "#trends.stream().sorted().collect(T(java.util.stream.Collectors).joining(','))")
    public ContentResponseDTO processTrends(List<String> trends){
        System.out.println("[Cache MISS] Calling Python FastAPI / Google AI...");
        try{
            return pythonWebClient.post()
                    .uri("/api/process-trends")
                    .bodyValue(Map.of("trends",trends))
                    .retrieve()
                    .bodyToMono(ContentResponseDTO.class)
                    .block();
        }
        catch(WebClientResponseException e){
            throw new RuntimeException(
                "Python API error : " + e.getStatusCode() + " - " + e.getResponseBodyAsString(), e
            );
        }
        catch(Exception e){
            throw new RuntimeException("Failed to connect with pyhton API:" + e.getMessage(),e);
        }

    }


    
}
