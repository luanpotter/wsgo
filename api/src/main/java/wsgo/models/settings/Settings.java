package wsgo.models.settings;

import io.yawp.repository.IdRef;
import io.yawp.repository.annotations.Endpoint;
import io.yawp.repository.annotations.Id;
import io.yawp.repository.annotations.Index;
import io.yawp.repository.annotations.Json;

import java.util.Map;

@Endpoint(path = "/settings")
public class Settings {

    @Id
    IdRef<Settings> id;

    @Index(normalize = false)
    String domain;

    @Json
    Map<Integer, RoomSettings> rooms;

}
